const Deck = require("../src/client/deck/deck.js");
const { rankHand } = require("./handEvaluator");

const cardDeck = new Deck();
const gameControl = {
  queuePlayers: [],
  players: [],
  cardDeck,
  handOver: false,
  gameBoard: [],
  currentPot: 0,
  currentBet: 0,
  gameState: "preflop"
};

const dealPlayers = () => {
  gameControl.board = [];
  gameControl.cardDeck.shuffle();
  console.log(gameControl.players[0]);
  for (let i = 0; i < gameControl.players.length; i++)
    gameControl.players[i].cards = gameControl.cardDeck.dealHand(2);
};

const queuePlayers = socketId => {
  gameControl.queuePlayers.push({
    //TODO: make this data come from DB
    id: socketId,
    name: "",
    bankroll: 1000,
    cards: [],
    activeTurn: false,
    actionCompleted: false,
    playerBet: 0
  });
};
const addPlayer = socketId => {
  //Filter New Player
  const playerToAdd = gameControl.queuePlayers.filter(
    player => player.id === socketId
  )[0];
  //Add New Player
  gameControl.players.push(playerToAdd);
  //Remove New Player form queue
  gameControl.queuePlayers = gameControl.queuePlayers.filter(
    player => player.id !== socketId
  );
};

const removePlayer = socketID => {
  //Remove Player
  gameControl.players = gameControl.players.filter(
    player => player.id !== socketID
  );
  // resetGame();
  //Remove player from queue
  gameControl.queuePlayers = gameControl.queuePlayers.filter(
    player => player.id !== socketID
  );
};
const dealBoard = () => {
  if (gameControl.gameState === "preflop") {
    gameControl.gameState = "flop";
    resetPlayerAction();

    gameControl.cardDeck.dealHand(3).forEach(card => {
      gameControl.gameBoard.push(card);
    });
  } else if (gameControl.gameState === "flop") {
    gameControl.gameState = "turn";
    resetPlayerAction();

    gameControl.cardDeck.dealHand(1).forEach(card => {
      gameControl.gameBoard.push(card);
    });
  } else if (gameControl.gameState === "turn") {
    gameControl.gameState = "river";
    resetPlayerAction();

    gameControl.cardDeck.dealHand(1).forEach(card => {
      gameControl.gameBoard.push(card);
    });
  } else if (gameControl.gameState === "river") {
    getWinner();
    console.log("Determine Winner");

    flipCards();
  }
};

const flipCards = () => {
  gameControl.handOver = !gameControl.handOver;
};

const resetGame = () => {
  gameControl.players.forEach(player => {
    player.cards = [];
  });
  gameControl.gameBoard = [];
  gameControl.currentPot = 0;
  gameControl.gameState = "preflop";
  // cardDeck = new Deck();
};
const getWinner = () => {
  handResults = [];
  gameControl.players.forEach(player => {
    playerHandRank = {
      name: "",
      id: "",
      rank: 0,
      hand: []
    };
    var rankHandData = rankHand(player.cards.concat(gameControl.gameBoard));

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

    potToPlayer(handResults[0].id, gameControl.currentPot);
    resetGame();
};

const potToPlayer = (socketId, potValue) => {
  const winningPlayer = gameControl.players.filter(
    player => player.id === socketId
  )[0];

  winningPlayer.bankroll += gameControl.currentPot;
}
const bet = (socketId, betVal) => {
  const currentPlayer = gameControl.players.filter(
    player => player.id === socketId
  )[0];

  //Add money to pot and subtract from user bank
  gameControl.currentPot += betVal;
  gameControl.currentBet += betVal;
  currentPlayer.bankroll -= betVal;
  currentPlayer.playerBet += betVal;

  console.log(`Player ${currentPlayer.id} is betting ${betVal}`);
  gameControl.players.forEach(player => {
    player.actionCompleted = false;
  });};

const call = (socketID, callVal) => {
  console.log("CallVal: " + callVal);
  const currentPlayer = gameControl.players.filter(
    player => player.id === socketID
  )[0];

  gameControl.currentPot += callVal - currentPlayer.playerBet;
  currentPlayer.bankroll -= callVal - currentPlayer.playerBet;
};

const raise = (socketId, betVal) => {
  const currentPlayer = gameControl.players.filter(
    player => player.id === socketId
  )[0];

  let raiseVal = betVal + gameControl.currentBet;
  //Add money to pot and subtract from user bank
  gameControl.currentPot += raiseVal - currentPlayer.playerBet;
  currentPlayer.bankroll -= raiseVal - currentPlayer.playerBet;
  currentPlayer.playerBet += raiseVal - currentPlayer.playerBet;
  gameControl.currentBet += betVal;

  console.log(`Player ${currentPlayer.id} is raising ${betVal}`);
  gameControl.players.forEach(player => {
    player.actionCompleted = false;
  });
};
const checkActionsCompleted = () => {
  for (let i = 0; i < gameControl.players.length; i++) {
    if (gameControl.players[i].actionCompleted === false) return false;
  }
  return true;
};

const resetPlayerAction = () => {
  for (let i = 0; i < gameControl.players.length; i++) {
    gameControl.players[i].actionCompleted = false;
    gameControl.players[i].playerBet = 0;
  }
  gameControl.currentBet = 0;
};

const fold = socketID => {
  const playerWinner = gameControl.players.filter(
    player => player.id !== socketID
  )[0];

  console.log(playerWinner);
  potToPlayer(playerWinner.id,gameControl.currentPot);
  resetGame();
  //TODO: give pot to player and reset game;
};
const check = socketID => {
  for (let i = 0; i < gameControl.players.length; i++) {
    if (gameControl.players[i].id === socketID) {
      gameControl.players[i].actionCompleted = true;

      if (i + 1 < gameControl.players.length) {
        gameControl.players[i].activeTurn = false;
        gameControl.players[i + 1].activeTurn = true;
      } else {
        gameControl.players[0].activeTurn = true;
        gameControl.players[i].activeTurn = false;
      }
    }
  }
  if (checkActionsCompleted()) {
    resetPlayerAction();
    dealBoard();
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
  call
};
