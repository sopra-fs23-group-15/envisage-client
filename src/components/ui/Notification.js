import React from "react";

export const Notification = (props) => {
  if (localStorage.getItem("curator") === localStorage.getItem("userName")) {
    return (
      <>
        <div
          style={
            props.players.length > 2
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          Hello {localStorage.getItem("curator")}, as the curator, please start
          the game when you are ready
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          style={
            props.players.length > 2
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          Get ready {localStorage.getItem("userName")}, your curator will start
          the game soon, please wait...
        </div>
      </>
    );
  }
};
