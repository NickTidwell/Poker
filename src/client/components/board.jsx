import React, { Component } from "react";

const Board = props => {
  const board = props.board;

  while (board.length < 5) board.push("empty");

  return (
    <div className="board">
      {board.map(card => {
        if (card === 'empty') {
          return <img
            style={{ width: "150px" }}
            src={`/img/cards/green_back.png`}
          />;
        } else {
         return  <img
            style={{ width: "150px" }}
            src={`/img/cards/${card}.png`}
          />;
        }
      })}
    </div>
  );
};
export default Board;
