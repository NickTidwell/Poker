import React, { Component } from 'react';

const Check = props => {
  if(props.currentBet === 0){

    return (

      <button onClick={props.check} className="btn btn-secondary">
        check
      </button>
    );
  }else return (<div/>)
  };
  
  export default Check;
  