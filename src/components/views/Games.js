import React, { useEffect, useState } from "react";
import {api, handleError} from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Timer } from "components/ui/Timer";
import { useParams } from "react-router-dom";
import TextArea from "./TextArea";
import "styles/views/Game.scss";

const Games = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  // const [keywords, setKeywords] = useState(null);
  const { lobbyId, roundId } = useParams();

  useEffect(() => {
    async function fetchImage() {
      try {
        //const response = await api.get("/metMuseum");
        //await new Promise((resolve) => setTimeout(resolve, 1000));
        const challengeImage = localStorage.getItem("challengeImage");
        console.log(challengeImage);
        setImage(challengeImage);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchImage();
    console.log(localStorage.getItem("image"));
  }, []);

  const submitPrompt = async () => {
    try {
      // const requestBody = JSON.stringify({ keywords });
      // await api.put(
      //   "/lobbies/" +
      //     lobbyId +
      //     "/games/" +
      //     roundId +
      //     localStorage.getItem("player"),
      //   requestBody
      // );
      /**just for testing purpose**/
      const username = localStorage.getItem("userName");
      const keywords = "little penguin running";
      const requestBody = JSON.stringify({ keywords });
      await api.put(`/lobbies/${lobbyId}/games/${roundId}/${username}`, requestBody)
      navigate(`/lobbies/${lobbyId}/games/${roundId}/votePage`);
    } catch (error) {
      console.error(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the users! See the console for details."
      );
    }
  };

  return (
    <div className="game">
      <img className="game image" src={image} alt="" />
      <div className="game input">
        <Timer func={submitPrompt} />
        <div className="game input-style">
          {localStorage.getItem("challengeStyle")}
        </div>        
        {/* <textarea
          className="game input-field"
          placeholder="tweak your keywords to make it more fun!"
          // onChange={(kw) => setKeywords(kw)}
        /> */}
        <TextArea />
        <Button className="G" onClick={() => submitPrompt()}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Games;
