import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Timer } from "components/ui/Timer";
// import { TextArea } from "components/ui/TextArea";
import "styles/views/Game.scss";
import { connect, isConnected, subscribe } from "../../helpers/stomp";

const MAX_CHARS = 400;

const Games = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const { lobbyId, roundId } = useParams();
  const [keywords, setKeywords] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    const inputCharCount = inputText.length;
    if (inputCharCount > MAX_CHARS) {
      return;
    }
    setKeywords(inputText);
    setCharCount(inputCharCount);
  };

  const inputStyle = {
    border: charCount > MAX_CHARS ? "2px solid red" : "",
  };

  useEffect(() => {
    console.log("Connected Lobbies: " + isConnected());

    if (!isConnected()) {
      connect(subscribeEssential);
    }

    function subscribeEssential() {
      subscribe(`/topic/lobbies/${lobbyId}`, () => {
        console.log("Subscribed to lobby");
      });
    }
    async function fetchImage() {
      try {
        const challengeImage = localStorage.getItem("challengeImage");
        setImage(challengeImage);
        console.log(
          localStorage.getItem("player") !== localStorage.getItem("curator")
        );
      } catch (error) {
        console.error(
          `Something went wrong while fetching the image: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the image! See the console for details."
        );
      }
    }
    fetchImage();
  }, [lobbyId]);

  const submitPrompt = async () => {
    console.log("user prompt is: " + prompt);
    try {
      if(keywords.length === 0){
        setKeywords("blank canvas")
      }
      const requestBody = JSON.stringify({
        keywords,
      });
      console.log(requestBody);
      const playerImage = await api.put(
        `/lobbies/${lobbyId}/games/${roundId}/${localStorage.getItem("userName")}`,
        requestBody
      );
      console.log(playerImage.data);
      // code to sleep for 5 seconds...
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
        <Timer func={() => submitPrompt(keywords)} />
        <div className="game input-style">
          {localStorage.getItem("challengeStyle")}
        </div>
        <>
          <label className="game input-label">
            Describe your image {charCount}/{MAX_CHARS}
          </label>
          <textarea
            className="game input-field"
            style={inputStyle}
            value={keywords}
            onChange={handleInputChange}
            placeholder="tweak your keywords to make it more fun! (max 400 characters)"
          />
        </>
        <Button className="G" onClick={() => submitPrompt(keywords)}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Games;
