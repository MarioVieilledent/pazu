const socket = new WebSocket("ws://localhost:8080/ws");

let isSocketOpen = false;

socket.addEventListener("open", () => {
  isSocketOpen = true;
  socket.send(JSON.stringify({ event: "ping" }));
});

socket.addEventListener("error", () => {
  isSocketOpen = false;
});

socket.addEventListener("close", () => {
  isSocketOpen = false;
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  if (data.event === "readAllResponse") {
    document.getElementById("pre").textContent = JSON.stringify(
      JSON.parse(data.data),
      null,
      2
    );
  }
});

function write(key, value, pwd) {
  if (isSocketOpen) {
    socket.send(JSON.stringify({ event: "write", key, value, pwd }));
  } else {
    console.warn("WebSocket is not open.");
  }
}

function read(key, pwd) {
  if (isSocketOpen) {
    socket.send(JSON.stringify({ event: "read", key, pwd }));
  } else {
    console.warn("WebSocket is not open.");
  }
}

function readAll(pwd) {
  if (isSocketOpen) {
    socket.send(JSON.stringify({ event: "readAll", pwd }));
  } else {
    console.warn("WebSocket is not open.");
  }
}

function send() {
  if (isSocketOpen) {
    const pwd = document.getElementById("pwd").value;
    const key = document.getElementById("key").value;
    const value = document.getElementById("value").value;
    write(key, value, pwd);
  } else {
    console.warn("WebSocket is not open.");
  }
}

function requestReadAll() {
  if (isSocketOpen) {
    const pwd = document.getElementById("pwd").value;
    readAll(pwd);
  } else {
    console.warn("WebSocket is not open.");
  }
}
