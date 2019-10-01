import React, { Component } from "react";

const Fold = props => {
  return (
    <button onClick={props.fold} className="btn btn-secondary">
      Fold
    </button>
  );
};

export default Fold;