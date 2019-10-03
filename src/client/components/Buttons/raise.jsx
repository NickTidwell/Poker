import React, { Component } from 'react';

const Raise = props => {
  let raiseValue = props.currentRaise

  if(props.currentBet > 0){
    return (
      <button onClick={props.raise} className="btn btn-secondary">
        raise ${raiseValue }
      </button>
    );
  }
   else return(<div/>)

  };
  
  export default Raise;
  