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
        You exhibition curator is: <span>{props.curator}</span>
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
        2. With a given picture and a style requirement, your task is to
        describe the image as creative as possible, while adding in the style
        requirement.
      </h5>
      <h5>
        3. At the end of each round, you vote on your favorite picture.and the
        round winner is given as your prompt for the next round with a different
        style requirement.
      </h5>
      <h5>
        4. The round winner is given as your prompt for the next round with a
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
