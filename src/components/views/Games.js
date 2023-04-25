import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Timer } from "components/ui/Timer";
import { useParams } from "react-router-dom";
// import TextArea from "./TextArea";
import "styles/views/Game.scss";
const MAX_CHARS = 400;

const Games = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  // const [keywords, setKeywords] = useState(null);
  const { lobbyId, roundId } = useParams();
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    const inputCharCount = inputText.length;
    if (inputCharCount > MAX_CHARS) {
      return;
    }
    setText(inputText);
    setCharCount(inputCharCount);
  };

  const inputStyle = {
    border: charCount > MAX_CHARS ? "2px solid red" : "",
  };
  const handlePromptChange = (value) => {
    setPrompt(value);
  };
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

  const submitPrompt = async (prompt) => {
    console.log("user prompt is: "+ prompt);
    try {
      const requestBody = JSON.stringify({ "prompt": prompt, "player": localStorage.getItem("player"), "lobbyId": localStorage.getItem("lobbyId") });
      console.log(requestBody);
      await api.post("/getdalleimage", requestBody);
      //code to sleep for 5 seconds...
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
        <Timer func={()=>submitPrompt(text)} />
        <div className="game input-style">
          {localStorage.getItem("challengeStyle")}
        </div>        
        {/* <textarea
          className="game input-field"
          placeholder="tweak your keywords to make it more fun!"
          // onChange={(kw) => setKeywords(kw)}
        /> */}
        <>
    <label className="game input-label">Describe your image. {charCount}/{MAX_CHARS}</label>
      <textarea
        className= "game input-field"
        style={inputStyle}
        value={text}
        onChange={handleInputChange}
        placeholder="tweak your keywords to make it more fun! (max 400 characters)"
      />
    </>
        <Button className="G" onClick={() => submitPrompt(text) }>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Games;
