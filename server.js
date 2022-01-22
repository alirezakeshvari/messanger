const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "admin";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome User"));

    // When another user connects
    socket.broadcast
      .to(room)
      .emit("joinLeft", formatMessage(user.username, `has joined the chat`));

    // send room and users info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chats

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, msg));
  });

  // When user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "joinLeft",
        formatMessage(user.username, `has left the chat`)
      );
    }

    // send room and users info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => console.log("Server is runnig on port " + PORT));
