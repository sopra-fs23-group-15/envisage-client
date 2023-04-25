import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Timer } from "components/ui/Timer";
// import { TextArea } from "components/ui/TextArea";
import "styles/views/Game.scss";

const MAX_CHARS = 400;

const Games = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
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

  useEffect(() => {
    async function fetchImage() {
      try {
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
      const response = await api.put(
        `/lobbies/${lobbyId}/games/${roundId}/${username}`,
        requestBody
      );
      console.log(response.data);
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
        <Timer func={() => submitPrompt(text)} />
        <div className="game input-style">
          {localStorage.getItem("challengeStyle")}
        </div>
        {/* <textarea
          className="game input-field"
          placeholder="tweak your keywords to make it more fun!"
          // onChange={(kw) => setKeywords(kw)}
        /> */}
        <>
          <label className="game input-label">
            Describe your image {charCount}/{MAX_CHARS}
          </label>
          <textarea
            className="game input-field"
            style={inputStyle}
            value={text}
            onChange={handleInputChange}
            placeholder="tweak your keywords to make it more fun! (max 400 characters)"
          />
        </>
        <Button className="G" onClick={() => submitPrompt(text)}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Games;
