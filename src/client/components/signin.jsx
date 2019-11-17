import React, { Component } from "react";

class SignIn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form>
        <div style={{ paddingTop: "25px", paddingLeft: "25px" }}>

          <p>
            <input type="text" onChange={this.props.handleEmailChange} />
            <span style={{ padding: "25px" }}>Enter Email</span>
          </p>

          <p>
            <input type="text" onChange={this.props.handlePasswordChange} />
            <span style={{ padding: "25px" }}>Enter Password</span>
          </p>
        </div>

        <button
          style={{ display: "block", marginLeft: "25px" }}
          onClick={this.props.SignIn}
          //onClick={() => this.joinGame()}
          className="btn btn-secondary"
        >
          Sign In
        </button>

        <button
          style={{ display: "block", marginLeft: "25px", marginTop: "10px" }}
          onClick={this.props.gotoSignUp}
          //onClick={() => this.joinGame()}
          className="btn btn-secondary"
        >
          Create Account
        </button>
      </form>
    );
  }
}

export default SignIn;
