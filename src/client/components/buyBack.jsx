import React, { Component } from "react";

const BuyBack = props => {
  if (props.players.length > 0) {
    const players = props.players;
    const playerID = props.id;
    const localPlayer = players.filter(player => player.id === playerID);
    if (localPlayer[0].bankroll <= 0) {
      return <button onClick={props.buyback} className="btn btn-secondary">Buy Back</button>;
    } else return <div/>;
  }else
  {
    return <div>Loading...</div>
  }
};

export default BuyBack;
