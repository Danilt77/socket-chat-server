const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

const route = require("./route");
const { addUser, findUser, removeUser, getUsers } = require("./users");

let messages = [];

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (nickname) => {
    socket.join();

    const user = addUser(nickname);

    socket.emit("showMessages", messages);

    socket.on("updateUsers", () => {
      socket.emit("updateUsers", getUsers());
    });

    socket.broadcast.emit("updateUsers", getUsers());

    socket.emit("message", {
      data: {
        user: "CHAT",
        message: `Вы зашли в чат, ${nickname}`,
      },
    });

    socket.broadcast.emit("message", {
      data: {
        user: "CHAT",
        message: `${nickname} зашел в чат`,
      },
    });

    socket.on("disconnect", () => {
      removeUser(nickname);
      socket.broadcast.emit("updateUsers", getUsers());
      socket.broadcast.emit("message", {
        data: {
          user: "CHAT",
          message: `${nickname} вышел из чата`,
        },
      });
    });
  });

  socket.on("sendMessage", ({ message, nickname }) => {
    const user = findUser(nickname);
    messages.push({ user: user, message: message });
    if (user) {
      io.emit("message", { data: { user, message } });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});

server.listen(5000, () => {
  console.log("Server is running");
});
