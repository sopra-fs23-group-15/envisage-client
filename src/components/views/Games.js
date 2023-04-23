import React, { useEffect, useState } from "react";
import {handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Timer } from "components/ui/Timer";
import { useParams } from "react-router-dom";
import "styles/views/Game.scss";

const Games = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  // const [keywords, setKeywords] = useState(null);
  const { lobbyId } = useParams();


  useEffect(() => {
    async function fetchImage() {
      try {
        //const response = await api.get("/metMuseum");
        //await new Promise((resolve) => setTimeout(resolve, 1000));
        const challengeImage = localStorage.getItem('challengeImage')
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
      navigate(`/lobbies/${lobbyId}`);
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
      <img className="game image" src={image} alt=""/>
      <div className="game input">
        <Timer func={submitPrompt} />
        <div className="game input-style">{localStorage.getItem("challengeStyle")}</div>
        <label className="game input-label">Describe your image</label>
        <textarea
          className="game input-field"
          placeholder="tweak your keywords to make it more fun!"
          // onChange={(kw) => setKeywords(kw)}
        />
        <Button className="G" onClick={() => submitPrompt()}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Games;
