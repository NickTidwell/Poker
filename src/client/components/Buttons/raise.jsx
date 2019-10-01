import React, { Component } from 'react';

const Raise = props => {

  if(props.currentBet > 0){
    return (
      <button onClick={props.raise} className="btn btn-secondary">
        raise ${props.currentRaise}
      </button>
    );
  }
   else return(<div/>)

  };
  
  export default Raise;
  