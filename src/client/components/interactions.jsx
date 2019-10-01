import React, { Component } from "react";
import Bet from "./Buttons/bet";
import Check from "./Buttons/check";
import Fold from "./Buttons/fold";
import Raise from "./Buttons/raise";
import BetSlider from "./Buttons/betSlider";
import Call from "./Buttons/call";
const Interactions = props => {
  const players = props.players;
  const playerID = props.id;
  const localPlayer = players.filter(player => player.id === playerID);
  return (
    <div>
      {localPlayer.map(player => {
        if (player.activeTurn)
          return (
            <div>
              <Bet bet={props.bet} currentBet={props.currentBet} currentRaise={props.currentRaise} />
              <Check check={props.check} currentBet={props.currentBet} />
              <Raise raise={props.raise} currentRaise={props.currentRaise} currentBet={props.currentBet} />
              <Fold fold={props.fold} />
              <Call call={props.call} currentBet={props.currentBet} playerBet={player.playerBet}/>
              <BetSlider
                currentBet={props.currentBet}
                bankroll={localPlayer[0].bankroll}
                changeBet={props.changeBet}
              />
            </div>
          );
      })}
    </div>
  );
};

export default Interactions;
