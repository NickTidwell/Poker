import React, { Component } from "react";

const Bet = props => {
  if(props.currentBet === 0){
  return (
    <button onClick={props.bet} className="btn btn-secondary">
      Bet ${props.currentRaise}
    </button>
  );
  }
  else{return <div/>}
};

export default Bet;
