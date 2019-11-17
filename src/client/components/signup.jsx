import React, { Component } from "react";

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form>
        <div style={{ paddingTop: "25px", paddingLeft: "25px" }}>
          <p>
            <input type="text" onChange={this.props.handleNameChange} />
            <span style={{ padding: "25px" }}>Enter Name</span>
          </p>

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
          onClick={this.props.signup}
          //onClick={() => this.joinGame()}
          className="btn btn-secondary"
        >
          Sign Up
        </button>

        <button
          style={{ display: "block", marginLeft: "25px", marginTop: "10px" }}
          onClick={this.props.gotoSignIn}
          //onClick={() => this.joinGame()}
          className="btn btn-secondary"
        >
          Already Have an Account Sign In
        </button>
      </form>
    );
  }
}

export default Signup;
