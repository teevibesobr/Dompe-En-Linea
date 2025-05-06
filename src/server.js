const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use("/public", express.static(__dirname + "/../public"));
app.use("/src", express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/../index.html");
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join_room", ({ room, name }) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push({ id: socket.id, name });
    io.to(room).emit("update_players", rooms[room].map(p => p.name));
  });

  socket.on("start_game", (room) => {
    io.to(room).emit("game_started");
  });

  socket.on("send_phrase", ({ room, text, name }) => {
    io.to(room).emit("phrase", { text, name });
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(p => p.id !== socket.id);
      io.to(room).emit("update_players", rooms[room].map(p => p.name));
    }
  });
});

server.listen(3000, () => console.log("Servidor en http://localhost:3000"));
