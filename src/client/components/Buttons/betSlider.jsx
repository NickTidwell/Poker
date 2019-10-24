import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

class BetSlider extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { value: props.currentBet };
  }

  handleChange = (object, value) => {
    this.setState({ value });
    this.props.changeBet(this.state.value);
  };
  handleChangeComplete = () => {
    this.props.changeBet(this.state.value);
    console.log("Change Completee");
  };

  render() {
    if(this.props.bankroll - this.props.currentBet > 0)
    {
    return (

      <div style={{ width: 400 }} className="slider">
        <Typography>Bet Amount</Typography>
        <Slider
          value={this.state.value}
          min={this.props.currentBet}
          max={this.props.bankroll - this.props.currentBet}
          //   defaultValue={this.props.currentBet}
          valueLabelDisplay="auto"
          onChange={this.handleChange}
          onChangeCommitted={this.handleChangeComplete}
        />
        ${this.state.value}
      </div>
    );
    }
    else return(<div/>);
  }
}

export default BetSlider;
