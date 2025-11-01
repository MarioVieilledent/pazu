package main

import (
	"fmt"
	"net/http"
	"os"
)

func startServer() {
	ip := os.Getenv("IP")
	if ip == "" {
		ip = "::"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8100"
	}

	addr := fmt.Sprintf("[%s]:%s", ip, port)

	fs := http.FileServer(http.Dir("./client"))

	http.Handle("/", fs)

	fmt.Printf("Starting server on http://%s\n", addr)

	err := http.ListenAndServe(addr, nil)

	if err != nil {
		fmt.Println(err)
	}
}
