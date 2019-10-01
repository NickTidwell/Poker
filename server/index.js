const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const {
  gameControl,
  dealPlayers,
  queuePlayers,
  addPlayer,
  flipCards,
  dealBoard,
  resetGame,
  bet,
  check,
  removePlayer,
  raise,
  fold,
  call
} = require("./gameHelper");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

const server = app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
const io = require("socket.io").listen(server);

io.on("connection", socket => {
  console.log("Connection made", socket.id);
  socket.emit("localId", socket.id);
  queuePlayers(socket.id);

  socket.on("joinGame", () => {
    addPlayer(socket.id);

    // if (gameControl.players.length > 0) {
    //   dealPlayers();
    gameControl.players[0].activeTurn = true;
    // }
    io.sockets.emit("gameControl", gameControl);
  });
  io.sockets.emit("gameControl", gameControl);

  socket.on("disconnect", () => {
    console.log("Disconnecting", socket.id);
    removePlayer(socket.id);
    io.sockets.emit("gameControl", gameControl);
  });

  socket.on("dealPlayer", () => {
    if (gameControl.players.length > 0) {
      dealPlayers();
      io.sockets.emit("gameControl", gameControl);
    }
  });
  socket.on("dealBoard", () => {
    dealBoard();
    io.sockets.emit("gameControl", gameControl);
  });

  socket.on("flip", () => {
    flipCards();
    io.sockets.emit("gameControl", gameControl);
  });

  socket.on("resetGame", () => {
    resetGame();
    io.sockets.emit("gameControl", gameControl);
  });

  socket.on("bet", event => {
    bet(socket.id, event);
    check(socket.id);
    io.sockets.emit("gameControl", gameControl);
  });

  socket.on("check", event => {
    check(socket.id);
    io.sockets.emit("gameControl", gameControl);
  });

  socket.on("fold", event =>{

    fold(socket.id);
    io.sockets.emit("gameControl", gameControl);
  });

  socket.on("call", event =>{
    call(socket.id,event);
    check(socket.id);
    io.sockets.emit("gameControl", gameControl);
  })
  socket.on("raise", event =>{
    raise(socket.id, event);
    check(socket.id);
    io.sockets.emit("gameControl", gameControl);
  })
});
