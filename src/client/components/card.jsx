import React, { Component } from "react";
const Card = (props) => {
  const playersInLobby = props.players;
  const playerID = props.id;
	const localPlayer = playersInLobby.filter((player) => player.id === playerID);
  return (
    <div className="playerCards">
      {localPlayer.map(player => {
        if (player.cards.length > 0) {
          return (
            <div>
              <img style={{width:"150px"}} 
               src={`/img/cards/${player.cards[0]}.png`} />
              <img
                style={{width: "150px"}}
                src={`/img/cards/${player.cards[1]}.png`}
              />
            </div>
          );
        } else return <div />;
      })}
    </div>

  );
};

export default Card;
