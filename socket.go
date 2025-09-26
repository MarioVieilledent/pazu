package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// Upgrade HTTP connection to WebSocket
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Upgrade connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	var event string
	var message string
	var data string

	for {
		// Read message from client
		messageType, raw, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		fmt.Printf("Received: %s\n", raw)

		var request map[string]string
		err = json.Unmarshal(raw, &request)
		if err != nil {
			fmt.Println("Error unmarshaling JSON:", err)
		}

		if requestEvent, ok := request["event"]; ok {
			if requestEvent == "ping" {
				event = "ping"
				message = "pong"
			}
			if requestEvent == "write" {
				event = "writeConfirmations"
				err = write(request["key"], request["value"], request["pwd"])
				if err != nil {
					message = err.Error()
				} else {
					message = "Entry written"
				}
			}
			if requestEvent == "read" {
				event = "readValue"
				value, err := read(request["key"], request["pwd"])
				if err != nil {
					message = err.Error()
				} else {
					resp, err := json.Marshal(value)
					if err != nil {
						message = err.Error()
					} else {
						message = string(resp)
					}
				}
			}
			if requestEvent == "readAll" {
				event = "readAllResponse"
				value, err := readAll(request["pwd"])
				if err != nil {
					message = err.Error()
				} else {
					resp, err := json.Marshal(value)
					if err != nil {
						message = err.Error()
					} else {
						message = "ok"
						data = string(resp)
					}
				}
			}
		}

		// Send message back to client
		response := map[string]string{
			"event":   event,
			"message": message,
			"data":    data,
		}
		responseBytes, _ := json.Marshal(response)
		err = conn.WriteMessage(messageType, responseBytes)
		if err != nil {
			log.Println("Write error:", err)
			break
		}
	}
}

func startSocket() {
	http.HandleFunc("/ws", handleWebSocket)

	fmt.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
