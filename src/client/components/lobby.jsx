import React, { Component } from 'react';

const Lobby = props =>{
    const currentPot = props.currentPot;
    return(

        <div>
            <div>

            Current Pot: {currentPot}
            </div>
      
        </div>
    )
}

export default Lobby;
