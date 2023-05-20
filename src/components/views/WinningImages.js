import { useNavigate, useLocation } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import { Button } from "components/ui/Button";
import React, { useEffect, useState } from "react";
import { Spinner } from "components/ui/Spinner";
import ImageComponent from "./Image";

import "styles/views/Exhibition.scss";
import {api, handleError} from "helpers/api";
import Alert from '@mui/material/Alert';

const WinningImages = () => {
  const [imgs, setImgs] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const goMain = async () => {
    localStorage.removeItem("lobbyId");
    navigate("landingPage");
  };
  const goToScores = async () => {
     navigate(`/lobbies/${lobbyId}/finalResult`, {state: { currentRound: state.currentRound },});
  };

  const goToExhibition = async () => {
    navigate(`/lobbies/${lobbyId}/exhibitionPage`, {state: { currentRound: state.currentRound },});
  }

  const lobbyId = localStorage.getItem("lobbyId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    try {
      async function fetch() {
        const response = await api.get(
          `/lobbies/${lobbyId}/games/winners`
        );
        console.log(response.data);
        setImgs(response.data);
      }
      fetch();
    } catch (error) {
        return (<Alert>Something went wrong when opening the exhibition: \n${handleError(error)}</Alert>);
    }
  }, [lobbyId]);

  let imageList = (
    <>
      <Spinner backgroundImage={localStorage.getItem("challengeImage")} />
    </>
  );
  if (imgs) {
    imageList = (
      <div className= " exhibition image-container">
        {imgs.map((image) => (
          <ImageComponent className = "exhibition" url={true} image={image.image} />
        ))}
      </div>
    );
  }

  return (
    <LobbyContainer>
      {imageList}
      <div className="exhibition button-container">
        <>
          <h3>
            Hello <span>{userName}</span>! Visit the winning images
          </h3>
        </>
        <Button className = "E" onClick={() => goToExhibition()}>Visit Exhibition</Button>
        <Button className = "E" onClick={() => goToScores()}>Scoreboard</Button>
        <Button className = "E" onClick={() => goMain()}>Logout</Button>
      </div>
    </LobbyContainer>
  );
};

export default WinningImages;
