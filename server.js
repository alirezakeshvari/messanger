const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "admin";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.emit("message", formatMessage(botName, "Welcome User"));

  // When another user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has joined the chat")
  );

  // When user disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });

  // Listen for chats

  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("user", msg));
  });
});

const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => console.log("Server is runnig on port " + PORT));
