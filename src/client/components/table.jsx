import React, { Component } from "react";
import io from "socket.io-client";
import Enemy from "./enemy";
import Card from "./card";
import Board from "./board";
import Interactions from "./interactions";
import Pot from "./pot";
import Signup from "./signup";
import SignIn from "./signin";
import UserData from "./UserData";
import BuyBack from "./buyBack";

let socket;

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      db_id: "",
      joined: false,
      signUp: true,
      signIn: false,
      signUpSuccess: false,
      signInSuccess: false,
      viewUserData: false,
      name: "",
      email: "",
      password: "",
      currentRaise: 0,
      roomId: 0,
      playerQueryData: {
        hands_played: 0,
        hands_won: 0,
        hands_lost: 0,
        bankroll: 0,
        avg_strength: 0.0
      },
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

    socket.on("roomId", roomId => {
      this.setState({ roomId });
    });

    socket.on("signUpSuccess", signUpSuccess => {
      this.setState({ signUpSuccess });
    });

    socket.on("signInSuccess", signInSuccess => {
      this.setState({ signInSuccess });
    });

    socket.on("setName", name => {
      this.setState({ name });
    });

    socket.on("setDBID", db_id => {
      this.setState({ db_id });
    });

    socket.on("setQueryData", playerQueryData => {
      this.setState({ playerQueryData });
    });

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  getUserData = (filterVal, toggle) => {
    const dbID = this.state.db_id;
    socket.emit("getUserData", dbID, filterVal);
    this.setState({ viewUserData: toggle });
  };

  deleteAccount = () => {
    const dbID = this.state.db_id;
    socket.emit("deleteAccount", dbID);
    this.setState({ signInSuccess: false });
    this.setState({ signUpSuccess: false });
    this.gotoSignUp();
  };

  buyback = () => {
    const dbID = this.state.db_id;
    socket.emit("buyback", dbID, this.state.roomId);
  }
  toggleUserData = () => {
    this.setState({ viewUserData: !this.state.viewUserData });
  };
  call = () => {
    socket.emit("call", this.state.gameControl.currentBet, this.state.roomId);
  };
  raise = () => {
    const betAmmount = this.state.currentRaise;
    socket.emit("raise", betAmmount, this.state.roomId);
    this.setState({ currentRaise: 0 });
  };
  bet = () => {
    const betAmmount = this.state.currentRaise;
    socket.emit("bet", betAmmount, this.state.roomId);
    this.setState({ currentRaise: 0 });
  };
  fold = () => {
    socket.emit("fold", this.state.roomId);
  };
  changeBet = currentRaise => {
    this.setState({ currentRaise });
  };
  check = () => {
    socket.emit("check", this.state.roomId);
  };
  flip = () => {
    socket.emit("flip", this.state.roomId);
  };
  deal = () => {
    socket.emit("dealBoard", this.state.roomId);
  };
  joinGame = () => {
    socket.emit("joinGame", this.state.roomId);
    this.setState({ joined: true });
  };
  resetGame = () => {
    socket.emit("resetGame", this.state.roomId);
  };
  dealPlayer = () => {
    socket.emit("dealPlayer", this.state.roomId);
  };

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  signup = () => {
    console.log("Signup Emmitted");
    socket.emit(
      "signup",
      this.state.name,
      this.state.email,
      this.state.password
    );

    this.gotoSignIn();
  };

  signIn = () => {
    console.log("Emmitting Sign In");
    socket.emit("signIn", this.state.email, this.state.password);
    this.setState({ signIn: false });
    //this.joinGame();
  };
  gotoSignIn = () => {
    this.setState({ signUp: false });
    this.setState({ signIn: true });
  };

  gotoSignUp = () => {
    this.setState({ signUp: true });
    this.setState({ signIn: false });
  };

  render() {
    if (this.state.signUp === true) {
      return (
        <div>
          <Signup
            signup={this.signup}
            handleNameChange={this.handleNameChange}
            handleEmailChange={this.handleEmailChange}
            handlePasswordChange={this.handlePasswordChange}
            gotoSignIn={this.gotoSignIn}
          />
          <div> {this.state.name}</div>
          <div> {this.state.email}</div>
          <div> {this.state.password}</div>
        </div>
      );
    } else if (this.state.signIn === true) {
      return (
        <div>
          <SignIn
            SignIn={this.signIn}
            gotoSignUp={this.gotoSignUp}
            handleEmailChange={this.handleEmailChange}
            handlePasswordChange={this.handlePasswordChange}
          />
        </div>
      );
    } else if (
      this.state.signInSuccess === false &&
      this.state.signUpSuccess === false
    ) {
      return (
        <div>
          <p>Could Not Sign In</p>
          <button
            style={{ display: "block", marginLeft: "25px" }}
            onClick={this.gotoSignIn}
            //onClick={() => this.joinGame()}
            className="btn btn-secondary"
          >
            Return
          </button>
        </div>
      );
    }

    return (
      <div>
        <div>
          <div>
            <p
              style={{
                display: "inline-block",
                margin: "0",
                paddingTop: "20px"
              }}
            >
              Current User: {this.state.name}
              <button
                onClick={() => this.deleteAccount()}
                className="btn btn-secondary"
              >
                DeleteAccount
              </button>
            </p>
          </div>
          <BuyBack
            players={this.state.gameControl.players}
            id={this.state.id}
            buyback={this.buyback}
          />
          <UserData
            viewUserData={this.state.viewUserData}
            playerQueryData={this.state.playerQueryData}
            playerName={this.state.name}
            getUserData={this.getUserData}
            toggleUserData={this.toggleUserData}
          />

          <Card players={this.state.gameControl.players} id={this.state.id} />
          <Enemy
            players={this.state.gameControl.players}
            handOver={this.state.gameControl.handOver}
            id={this.state.id}
          />
          <Board board={this.state.gameControl.gameBoard} />
          {
            // <button onClick={() => this.flip()} className="btn btn-secondary">
            //   Flip Cards
            // </button> 
            /* <button onClick={() => this.deal()} className="btn btn-secondary">
            Deal Card
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
          </button> */
          }
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
