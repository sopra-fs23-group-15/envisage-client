import React, { useState } from "react";
import { useParams } from "react-router-dom";

const LobbyBanner = (props) => {
  const [changeBanner, setChangeBanner] = useState(false);
  const { lobbyId } = useParams();

  const toggle = () => {
    setChangeBanner(!changeBanner);
  };

  let playerUp = (
    <div>
      <h3>
        You are in the <span>{lobbyId}</span> museum space
      </h3>
      <h3>
        Your exhibition curator is: <span>{props.curator}</span>
      </h3>
      <h3
        style={
          props.players.length > 2
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        Fill this wall with your masterpieces!
      </h3>
      <h5
        style={
          props.players.length > 2
            ? { visibility: "hidden" }
            : { visibility: "visible" }
        }
      >
        Please wait for <span>{3 - props.players.length}</span> more players to
        join
      </h5>
    </div>
  );

  let howToPlay = (
    <div>
      <h5>
        1. In each round, you compete with each other to create the best AI
        generated masterpieces.
      </h5>
      <h5>
        2. With <span>a given image and a style requirement</span>, your task is
        to{" "}
        <span>use keywords to describe the image as creatively as possible.</span>
      </h5>
      <h5>
        3. The style requirement such as{" "}
        <span style={{ fontStyle: "oblique" }}>"Pablo Picasso"</span> can be
        directly used as a keyword in your description or if you happen to be a
        story master of art history, feel free to tweak it into something more
        informative and fun!
      </h5>
      <h5>
        4. At the end of each round,{" "}
        <span>you vote on your favorite picture other than your own.</span> The
        round winner is given as the image prompt for the next round with a
        different style requirement.
      </h5>
      <h5>5. The final winner is declared based on the accumulated votes.</h5>
    </div>
  );

  return (
    <div className="player up">
      {!changeBanner && playerUp}
      {changeBanner && howToPlay}
      <h5>
        How to play:{" "}
        <span onClick={toggle} style={{ cursor: "pointer" }}>
          {changeBanner ? "ⓧ" : "⇨"}
        </span>
      </h5>
    </div>
  );
};

export default LobbyBanner;
