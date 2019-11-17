import React, { Component } from "react";
import { border } from "@material-ui/system";

const UserData = props =>{
  
    // var data = props.getUserData();
    if(props.viewUserData)
    {
    
    return (
      <form style = {{float: "right", padding: '30px' }}>
        <div style = {{border: '2px solid #73AD21', borderRadius: '25px', padding: '25px'}}>
          <ul>
            <li>
            Hands Played: {props.playerQueryData.hands_played}
            </li>
            <li>
            Hands_Won: {props.playerQueryData.hands_won}
            </li>
          </ul>
        {/* <p> </p>
        <p> </p> */}
        </div>

      </form>
    );
    }
    else{
      return (
        <div/>
      )
    }
  
}

export default UserData;
