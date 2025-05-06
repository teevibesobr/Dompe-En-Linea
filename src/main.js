const socket = io();
let room = "";
let name = "";

function joinRoom() {
  name = document.getElementById("playerName").value;
  room = document.getElementById("roomCode").value;
  socket.emit("join_room", { room, name });
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";
}

function startGame() {
  socket.emit("start_game", room);
}

function sendPhrase(text) {
  socket.emit("send_phrase", { room, text, name });
}

socket.on("update_players", players => {
  document.getElementById("players").innerHTML = players.map(p => "<p>" + p + "</p>").join("");
});

socket.on("game_started", () => {
  document.getElementById("status").innerText = "¡El juego ha comenzado!";
});

socket.on("phrase", ({ name, text }) => {
  const msg = document.createElement("p");
  msg.textContent = `${name}: ${text}`;
  document.getElementById("board").appendChild(msg);
});
