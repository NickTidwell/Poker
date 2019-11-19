import React, { Component } from "react";
import { border, height } from "@material-ui/system";

class UserData extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 5
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSumbitData = this.handleSumbitData.bind(this);
  }

  handleFilterChange = e => {
    console.log(e);
    this.setState({ value: e.target.value });
  };

  handleSumbitData(e) {
    console.log("PrventLoad");
    e.preventDefault();
    this.props.getUserData(this.state.value, true);
  }

  render() {
    if (this.props.viewUserData) {
      if (this.props.playerQueryData === null) {
        return (
          <form style={{ float: "right", padding: "30px" }}>
            <h1>No Player Data Recorded</h1>
            <button
              style={{ float: "right" }}
              onClick={this.props.toggleUserData}
              className="btn btn-secondary"
            >
              Hide Data
            </button>
          </form>
        );
      } else {
        return (
          <form style={{ float: "right", padding: "30px" }}>
            <button
              style={{ float: "right" }}
              onClick={this.props.toggleUserData}
              className="btn btn-secondary"
            >
              Hide Data
            </button>
            <div
              style={{
                border: "2px solid #73AD21",
                borderRadius: "25px",
                padding: "25px"
              }}
            >
              <h3>{this.props.playerName} Player Summary</h3>
              <ul>
                <li>Hands Played: {this.props.playerQueryData.hands_played}</li>
                <li>Hands_Won: {this.props.playerQueryData.hands_won}</li>
                <li>Hands Lost: {this.props.playerQueryData.hands_lost}</li>
                <li>Bankroll: {this.props.playerQueryData.bankroll}</li>
                <div>
                  <span>
                    Sort by last:
                    {"\t"}
                    <input
                      type="text"
                      style={{ width: "30px" }}
                      onChange={this.handleFilterChange}
                    />
                    {"\t"} Hands.
                    <button
                      style={{
                        float: "right",
                        height: "30px",
                        textAlign: "center",
                        verticalAlign: "middle"
                      }}
                      onClick={e => {
                        this.handleSumbitData(e);
                      }}
                      className="btn btn-secondary"
                    >
                      Filter
                    </button>
                  </span>
                </div>
                <p>
                  Average Hand Rank: {this.props.playerQueryData.avg_strength}
                  /8.0
                </p>
              </ul>
            </div>
          </form>
        );
      }
    } else {
      return (
        <button
          style={{ float: "right" }}
          onClick={() => this.props.getUserData(this.state.value, true)}
          className="btn btn-secondary"
        >
          Show Data
        </button>
      );
    }
  }
}

export default UserData;
