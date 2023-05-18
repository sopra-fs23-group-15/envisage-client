import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Game.scss";

const MAX_CHARS = 400;

const Games = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const { lobbyId, roundId } = useParams();
  const [keywordsInput, setKeywordsInput] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState({
    minutes: Math.floor(localStorage.getItem("roundDuration") / 60),
    seconds: localStorage.getItem("roundDuration") % 60,
  });

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    const inputCharCount = inputText.length;
    if (inputCharCount > MAX_CHARS) {
      return;
    }
    setKeywordsInput(inputText);
    setCharCount(inputCharCount);
  };

  const inputStyle = {
    border: charCount > MAX_CHARS ? "2px solid red" : "",
  };

  useEffect(() => {

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
    
    if (remainingTime.minutes === 0 && remainingTime.seconds === 0) {
      submitPrompt(keywordsInput);
    }
    else{
      const timer = setTimeout(() => {
        if (remainingTime.seconds > 0) {          
          setRemainingTime((prevTime) => ({
            ...prevTime,
            seconds: prevTime.seconds - 1,
          }));
        } else if (remainingTime.minutes > 0) {
          setRemainingTime((prevTime) => ({
            minutes: prevTime.minutes - 1,
            seconds: 59,
          }));
        }
      }, 1000);

      return () => clearTimeout(timer);
    }

  }, [remainingTime, lobbyId]);

  const submitPrompt = (keywords) => {
    if (isSubmitted === false) {
      setIsSubmitted(true);
      try {
        const requestBody = JSON.stringify({
          keywords,
          environment: process.env.NODE_ENV,
        });
        console.log(requestBody);
        api.put(
          `/lobbies/${lobbyId}/games/${roundId}/${localStorage.getItem(
            "userName"
          )}`,
          requestBody
        );
        navigate(`/lobbies/${lobbyId}/games/${roundId}/votePage`);
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
  };


  return (
    <div className="game">
      <img className="game image" src={image} alt="" />
      <div className="game input">
        {/* <Timer
          func={() => submitPrompt(keywordsInput)}
          seconds={localStorage.getItem("roundDuration") % 60}
          minutes={Math.floor(localStorage.getItem("roundDuration") / 60)}
        /> */}
        <div className="game timer">
        {/* 0{minutes}:{seconds > 9 ? "" : "0"}{seconds} */}
        0{remainingTime.minutes}:{remainingTime.seconds > 9 ? "" : "0"}{remainingTime.seconds}
        </div>
        {/* <CountdownTimer onComplete={() => submitPrompt(keywordsInput)} seconds={60}/> */}
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
            value={keywordsInput}
            onChange={handleInputChange}
            placeholder="tweak your keywords to make it more fun! (max 400 characters)"
          />
        </>
        <Button
          className="G"
          onClick={() => submitPrompt(keywordsInput)}
          disabled={isSubmitted}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Games;
