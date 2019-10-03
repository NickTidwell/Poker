import React, { Component } from "react";
import io from "socket.io-client";
import Enemy from "./enemy";
import Card from "./card";
import Board from "./board";
import Interactions from "./interactions";
import Pot from "./pot";
let socket;

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      joined: false,
      name: "",
      currentRaise: 0,
      gameControl: {
        queuePlayers: [],
        players: [],
        cardDeck: "",
        handOver: false,
        gameBoard: [],
        currentBet: 0,
        currentPot: 0
      }
    };
    socket = io.connect();

    socket.on("gameControl", gameControl => {
      this.setState({ gameControl });
    });

    socket.on("localId", id => {
      this.setState({ id });
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  call = () => {
    console.log("emitting Call");
    socket.emit("call", this.state.gameControl.currentBet);
  }
  raise = () => {
    console.log("emitting Raise");
    const betAmmount = this.state.currentRaise;
    socket.emit("raise", betAmmount);
    this.setState({currentRaise : 0});

  };
  bet = () => {
    console.log("emitting Bet");
    const betAmmount = this.state.currentRaise;
    socket.emit("bet", betAmmount);
    this.setState({currentRaise : 0});
  };
  fold = () => {
    console.log("emitting fold");
    socket.emit("fold");
  };
  changeBet = currentRaise => {
    console.log("Bet State Changed");
    this.setState({ currentRaise });
  };
  check = () => {
    console.log("emitting Check");
    socket.emit("check");
  };
  flip = () => {
    socket.emit("flip");
  };
  deal = () => {
    socket.emit("dealBoard");
  };
  joinGame = () => {
    socket.emit("joinGame");
    this.setState({ joined: true });
  };
  resetGame = () => {
    socket.emit("resetGame");
  };
  dealPlayer = () => {
    socket.emit("dealPlayer");
  };

  handleChange(event) {
    this.setState({ name: event.target.value });
    console.log("Name Set");
  }
  handleSubmit(event) {
    alert("Your favorite flavor is: " + this.state.value);
    event.preventDefault();
  }
  render() {
    if (this.state.joined === false) {
      return (
        <div>
          <form>
            <p>Enter Name</p>
            <input type="text" onChange={this.handleChange} />
            <button
              onClick={() => this.handleSubmit}
              onClick={() => this.joinGame()}
              className="btn btn-secondary"
            >
              Join Game
            </button>
          </form>
        </div>
      );
    }
    return (
      <div>
        <div>
          <p>Current User: {this.state.name}</p>

          <Card players={this.state.gameControl.players} id={this.state.id} />
          <Enemy
            players={this.state.gameControl.players}
            handOver={this.state.gameControl.handOver}
            id={this.state.id}
          />
          <Board board={this.state.gameControl.gameBoard} />
          <button onClick={() => this.deal()} className="btn btn-secondary">
            Deal Card
          </button>
          <button onClick={() => this.flip()} className="btn btn-secondary">
            Flip Cards
          </button>
          <button
            onClick={() => this.resetGame()}
            className="btn btn-secondary"
          >
            Reset Game
          </button>
          <button
            onClick={() => this.dealPlayer()}
            className="btn btn-secondary"
          >
            Deal Player
          </button>
        </div>
        <Pot currentPot={this.state.gameControl.currentPot} />
        <Interactions
          players={this.state.gameControl.players}
          id={this.state.id}
          bet={this.bet}
          check={this.check}
          raise={this.raise}
          fold={this.fold}
          call={this.call}
          changeBet={this.changeBet}
          currentBet={this.state.gameControl.currentBet}
          currentRaise={this.state.currentRaise}
        />
      </div>
    );
  }
}

export default Table;
