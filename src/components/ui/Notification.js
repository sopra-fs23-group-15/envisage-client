export const Notification = (props) => {
  if (localStorage.getItem("curator") === localStorage.getItem("userName")) {
    return (
      <>
        <div
          className="player special"
          style={
            props.players.length > 2
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          Hello <span>{localStorage.getItem("curator")}</span>, as the curator,
          please start the game when you are ready
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className="player special"
          style={
            props.players.length > 2
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          Get ready <span>{localStorage.getItem("userName")}</span>, your
          curator will start the game soon, please wait...
        </div>
      </>
    );
  }
};
