import React, { Component } from 'react';

const Call = props => {
  let callValue = props.currentBet - props.playerBet
  if(props.currentBet > 0){
    return (
      <button onClick={props.call} className="btn btn-secondary">
        call ${callValue}
      </button>
    );

  }else return(<div/>)
  };
  
  export default Call;
  