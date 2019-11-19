const Deck = require("../src/client/deck/deck.js");
const { rankHand } = require("./handEvaluator");
const {updateBankroll,insertHandRecord, getPlayerData} = require("./sqlHelper");
function gameControl(){
  this.queuePlayers = [],
  this.players= [],
  this.cardDeck= new Deck,
  this.handOver= false,
  this.gameBoard= [],
  this.currentPot= 0,
  this.currentBet= 0,
  this.gameState= "preflop",
  this.roomno= 0
}
const rooms = [];
var queue = [];

const dealPlayers = (roomId) => {
  rooms[roomId].board = []; 
  rooms[roomId].cardDeck.shuffle();
  for (let i = 0; i < rooms[roomId].players.length; i++)
  {
    if(rooms[roomId].players[i] !== undefined)
    {
      rooms[roomId].players[i].cards = rooms[roomId].cardDeck.dealHand(2);
    }
  }
};

const createLobby = (roomId) => {

  var control = new gameControl();
  rooms.push(control);
 
}
const queuePlayers = (socketId,roomno,db_id,p_name, bankroll) => {
  
  queue.push({
    id: socketId,
    db_id: db_id,
    name: p_name,
    bankroll: bankroll,
    cards: [],
    activeTurn: false,
    actionCompleted: false,
    playerBet: 0,
    roomId: roomno
  });
};

const addPlayer = (socketId,roomno)=> {
  //Filter New Player
  const playerToAdd = queue.filter(
    player => player.id === socketId
  )[0];

  //Add New Player
  rooms[roomno].players.push(playerToAdd);
  //Remove New Player form queue
  queue = queue.filter(
    player => player.id !== socketId
  );

};

const removePlayer = (socketID,roomId) => {
  //Remove Player
  rooms[roomId].players = rooms[roomId].players.filter(
    player => player.id !== socketID
  );
  // resetGame();
  //Remove player from queue
  queue = queue.filter(
    player => player.id !== socketID
  );
};

const dealBoard = async(roomId) => {
  if (rooms[roomId].gameState === "preflop") {
    rooms[roomId].gameState = "flop";
    resetPlayerAction(roomId);

    rooms[roomId].cardDeck.dealHand(3).forEach(card => {
      rooms[roomId].gameBoard.push(card);
    });
  } else if (rooms[roomId].gameState === "flop") {
    rooms[roomId].gameState = "turn";
    resetPlayerAction(roomId);

    rooms[roomId].cardDeck.dealHand(1).forEach(card => {
      rooms[roomId].gameBoard.push(card);
    });
  } else if (rooms[roomId].gameState === "turn") {
    rooms[roomId].gameState = "river";
    resetPlayerAction(roomId);

    rooms[roomId].cardDeck.dealHand(1).forEach(card => {
      rooms[roomId].gameBoard.push(card);
    });
  } else if (rooms[roomId].gameState === "river") {
    getWinner(roomId);
    rooms[roomId].gameState = "end";

  }
};

const flipCards = (roomId) => {
  rooms[roomId].handOver = !rooms[roomId].handOver;
};

const resetGame = (roomId) => {
  rooms[roomId].players.forEach(player => {
    player.cards = [];
    player.playerBet = 0;
  });
  rooms[roomId].gameBoard = [];
  rooms[roomId].currentBet = 0;
  rooms[roomId].currentPot = 0;
  rooms[roomId].gameState = "preflop";
  if (rooms[roomId].players.length > 1) {
    dealPlayers(roomId);
  }
  flipCards(roomId);
};
const getWinner = (roomId) => {
  handResults = [];
  rooms[roomId].players.forEach(player => {
    playerHandRank = {
      name: "",
      id: "",
      rank: 0,
      hand: []
    };
    var rankHandData = rankHand(player.cards.concat(rooms[roomId].gameBoard));

    playerHandRank.id = player.id;
    playerHandRank.name = player.name;
    playerHandRank.rank = rankHandData.rank;
    playerHandRank.hand = rankHandData.bestHand;

    handResults.push(playerHandRank);
  });
  handResults.sort((a, b) => {
    if (a.rank === b.rank) {
      if (a.hand[0][0] === "A") return -1;
      else if (b.hand[0][0] === "A") return 1;
      else if (a.hand[0][0] === "K") return -1;
      else if (b.hand[0][0] === "K") return 1;
      else if (a.hand[0][0] === "Q") return -1;
      else if (b.hand[0][0] === "Q") return 1;
      else if (a.hand[0][0] === "J") return -1;
      else if (b.hand[0][0] === "J") return 1;
      else if (a.hand[0][0] === "1") return -1;
      else if (b.hand[0][0] === "1") return 1;
      return a.hand[0][0] < b.hand[0][0];
    }
    a.rank < b.rank;
  });
  console.log(handResults);
  tie = 0;
  //Check for tie
  for (let i = 0; i < handResults.length - 1; i++) {
    if (handResults[i].rank === handResults[i + 1].rank) tie++;
    else break;
  }
  if (tie > 0) console.log(`${tie} way tie`);
  else
    console.log(
      `${handResults[0].id} Won the match with a ${handResults[0].rank}`
    );
    const p1 = rooms[roomId].players.filter(
      player => player.id === handResults[0].id
    )[0];

    const p2 = rooms[roomId].players.filter(
      player => player.id === handResults[1].id
    )[0];
    potToPlayer(handResults[1].id, roomId);

    insertHandRecord(p1.db_id,handResults[0].rank,1);
    insertHandRecord(p2.db_id,handResults[1].rank,0);

};

const potToPlayer = (socketId,roomId) => {
  const winningPlayer = rooms[roomId].players.filter(
    player => player.id === socketId
  )[0];

  const losingPlayer = rooms[roomId].players.filter(
    player => player.id !== socketId
  )[0];

  winningPlayer.bankroll += rooms[roomId].currentPot;

  updateBankroll(winningPlayer.bankroll,winningPlayer.db_id);
  updateBankroll(losingPlayer.bankroll,losingPlayer.db_id);

}
const bet = (socketId, betVal,roomId) => {
  const currentPlayer = rooms[roomId].players.filter(
    player => player.id === socketId
  )[0];

  //Add money to pot and subtract from user bank
  rooms[roomId].currentPot += betVal;
  rooms[roomId].currentBet += betVal;
  currentPlayer.bankroll -= betVal;
  currentPlayer.playerBet += betVal;

  console.log(`Player ${currentPlayer.id} is betting ${betVal}`);
  rooms[roomId].players.forEach(player => {
    player.actionCompleted = false;
  });};

const buyBack=(socketID,roomId) => {
  const currentPlayer = rooms[roomId].players.filter(
    player => player.id === socketID
  )[0];

  currentPlayer.bankroll = 1000;
};
const call = (socketID, callVal,roomId) => {
  console.log("CallVal: " + callVal);
  const currentPlayer = rooms[roomId].players.filter(
    player => player.id === socketID
  )[0];

  rooms[roomId].currentPot += callVal - currentPlayer.playerBet;
  currentPlayer.bankroll -= callVal - currentPlayer.playerBet;
};

const raise = (socketId, betVal,roomId) => {
  const currentPlayer = rooms[roomId].players.filter(
    player => player.id === socketId
  )[0];

  let raiseVal = betVal + rooms[roomId].currentBet;
  //Add money to pot and subtract from user bank
  rooms[roomId].currentPot += raiseVal - currentPlayer.playerBet;
  currentPlayer.bankroll -= raiseVal - currentPlayer.playerBet;
  currentPlayer.playerBet += raiseVal - currentPlayer.playerBet;
  rooms[roomId].currentBet += betVal;

  console.log(`Player ${currentPlayer.id} is raising ${betVal}`);
  rooms[roomId].players.forEach(player => {
    player.actionCompleted = false;
  });
};
const checkActionsCompleted = (roomId) => {
  for (let i = 0; i < rooms[roomId].players.length; i++) {
    if (rooms[roomId].players[i].actionCompleted === false) return false;
  }
  return true;
};

const resetPlayerAction = (roomId) => {
  for (let i = 0; i < rooms[roomId].players.length; i++) {
    rooms[roomId].players[i].actionCompleted = false;
    rooms[roomId].players[i].playerBet = 0;
  }
  rooms[roomId].currentBet = 0;
};

const fold = (socketID,roomId) => {
  const playerWinner = rooms[roomId].players.filter(
    player => player.id !== socketID
  )[0];

  console.log(playerWinner);
  potToPlayer(playerWinner.id,roomId);
  resetGame(roomId);
};
const check = (socketID,roomId) => {
  console.log(roomId);
  for (let i = 0; i < rooms[roomId].players.length; i++) {
    if (rooms[roomId].players[i].id === socketID) {
      rooms[roomId].players[i].actionCompleted = true;

      if (i + 1 < rooms[roomId].players.length) {
        rooms[roomId].players[i].activeTurn = false;
        rooms[roomId].players[i + 1].activeTurn = true;
      } else {
        rooms[roomId].players[0].activeTurn = true;
        rooms[roomId].players[i].activeTurn = false;
      }
    }
  }
  if (checkActionsCompleted(roomId)) {
     dealBoard(roomId);
 }

};
module.exports = {
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
  buyBack

};
