import React, { Component } from "react";
const Enemy = props => {
  const playersInLobby = props.players;
  const handOver = props.handOver;
  const playerID = props.id;
  const opponentPlayers = playersInLobby.filter(
    player => player.id !== playerID
  );

  return (
    <div>
      <div className="opponentCard">
        {opponentPlayers.map(player => {
          console.log(opponentPlayers);
          if (
            player.cards.length > 0 &&
            handOver === false &&
            opponentPlayers.indexOf(player) === 1
          ) {
            return (
              <div>
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/green_back.png`}
                />
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/green_back.png`}
                />
              </div>
            );
          } else if (
            player.cards.length > 0 &&
            handOver === true &&
            opponentPlayers.indexOf(player) === 1
          ) {
            return (
              <div>
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/${player.cards[0]}.png`}
                />
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/${player.cards[1]}.png`}
                />
              </div>
            );
          } else {
            return <div />;
          }
        })}
      </div>

      <div className="playerCard">
        {opponentPlayers.map(player => {
          if (
            player.cards.length > 0 &&
            handOver === false &&
            opponentPlayers.indexOf(player) === 0
          ) {
            return (
              <div>
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/green_back.png`}
                />
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/green_back.png`}
                />
              </div>
            );
          } else if (
            player.cards.length > 0 &&
            handOver === true &&
            opponentPlayers.indexOf(player) === 0
          ) {
            return (
              <div>
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/${player.cards[0]}.png`}
                />
                <img
                  style={{ width: "150px" }}
                  src={`/img/cards/${player.cards[1]}.png`}
                />
              </div>
            );
          } else {
            return <div />;
          }
        })}
      </div>
    </div>
  );
};

export default Enemy;
