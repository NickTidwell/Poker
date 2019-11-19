const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const Deck = require("../src/client/deck/deck.js");
const mysql = require("mysql");
const {deleteUser, getPlayerData,buyBackUser} = require("./sqlHelper");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "sys"
});
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
  call,
  checkActionsCompleted,
  resetPlayerAction,
  createLobby,
  rooms,
  getUserData,
  buyBack
} = require("./gameHelper");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

const server = app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);

const io = require("socket.io").listen(server);
var roomno = 0;

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Mysql");
});

createLobby(roomno);
console.log(rooms);


io.on("connection", socket => {
  console.log("Connection made", socket.id);
  socket.emit("localId", socket.id);
  //Only Queue Players on Sign In
  //queuePlayers(socket.id,roomno);

  joinGame = (() => {
    if (rooms[roomno].players.length > 1) {
      roomno++;
      createLobby(roomno, gameControl);
    }
    //Join Room
    socket.join(roomno);
    socket.emit("roomId", roomno);
    console.log("Joined: " + roomno);
    addPlayer(socket.id, roomno);

    // console.log(rooms[roomno].players[0]);
    // console.log(rooms[roomno].players[1]);

    if (rooms[roomno].players.length === 2) {
      dealPlayers(roomno);
      rooms[roomno].players[0].activeTurn = true;
    }

    io.sockets.in(roomno).emit("gameControl", rooms[roomno]);
  });
  io.sockets.in(roomno).emit("gameControl", rooms[roomno]);

  socket.on("disconnect", () => {
    console.log("Disconnecting", socket.id);
    removePlayer(socket.id, roomno);
    io.sockets.in(roomno).emit("gameControl", rooms[roomno]);
  });

  socket.on("dealPlayer", roomId => {
    if (rooms[roomsId].players.length > 0) {
      dealPlayers();
      io.sockets.in(roomsId).emit("gameControl", rooms[roomId]);
    }
  });

  socket.on("flip", roomId => {
    flipCards(roomId);
    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
  });

  socket.on("resetGame", roomId => {
    resetGame();
    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
  });

  socket.on("bet", (event, roomId) => {
    bet(socket.id, event, roomId);
    check(socket.id, roomId);
    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
  });

  socket.on("check", async roomId => {
    check(socket.id, roomId);
    if (rooms[roomId].gameState === "end") {
      flipCards(roomId);
      setTimeout(() => {
        resetGame(roomId);
        io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
      }, 3000);
    }
    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
  });

  socket.on("fold", roomId => {
    flipCards(roomId);
    setTimeout(() => {
      fold(socket.id, roomId);
      io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
    }, 3000);

    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
  });

  socket.on("getUserData" , async (db_id,filterVal) => {
      //Send Query Return Socket
      console.log("FilterVal In Index: " + filterVal);
      if(db_id === "")
        {
          console.log('Invalid ID');
          return;
        }
      getPlayerData(db_id, filterVal)
      .then(function(rows) {
        socket.emit("setQueryData", rows);
       })
      .catch(() => console.log("ERROR"));
      
  });

  socket.on("deleteAccount", (db_id) => {
    deleteUser(db_id);
  });

  socket.on("buyback", (db_id, roomId) => {
    buyBackUser(db_id);
    buyBack(socket.id,roomId);
    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);

  });
  socket.on("signIn", (email, pass) => {
    var sql = `select * from player where email = '${email}' and password = '${pass}'`;
    var signInSuccess = false;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      if (result.length > 0) {
        console.log("Acount Found");
        signInSuccess = true;
        io.sockets.emit("signInSuccess", true);
      } else {
        console.log("Acount Not Found");
        signInSuccess = false;
        io.sockets.emit("signInSuccess", false);
      }

      //QUEUE Player HERE
      if (signInSuccess === true) {
        socket.emit("setName", result[0].name);
        socket.emit("setDBID", result[0].player_id);
        queuePlayers(socket.id, roomno, result[0].player_id, result[0].name, result[0].bankroll);
        joinGame();
      }
    });
  });

  socket.on("signup", (name, email, pass) => {
    //We should vERIFY  inputed data here
    var sql = `select * from player where email = '${email}'`;
    var signUpSuccess = false;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      if (result.length > 0) {
        console.log("Email Taken");
        io.sockets.emit("signUpSuccess", signUpSuccess);
        return;
      } else {
        var sql = `INSERT INTO player (email,name, password, bankroll) VALUES('${email}','${name}', '${pass}', 1000)`;
        connection.query(sql, function(err, result) {
          if (err) throw err;
          console.log("Record Inserted");
          signUpSuccess = true;
          io.sockets.emit("signUpSuccess", signUpSuccess);
        });
      }
    });
  });

  socket.on("call", (event, roomId) => {
    call(socket.id, event, roomId);
    check(socket.id, roomId);
    if (rooms[roomId].gameState === "end") {
      flipCards(roomId);
      setTimeout(() => {
        resetGame(roomId);
        io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
      }, 3000);
    }
    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
  });
  socket.on("raise", (event, roomId) => {
    raise(socket.id, event, roomId);
    check(socket.id, roomId);
    io.sockets.in(roomId).emit("gameControl", rooms[roomId]);
  });
});
