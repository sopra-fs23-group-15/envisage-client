import { useNavigate, useLocation } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import { Button } from "components/ui/Button";
import React, { useEffect, useState } from "react";
import { Spinner } from "components/ui/Spinner";
import ImageComponent from "./Image";

import "styles/views/Exhibition.scss";
import {api, handleError} from "helpers/api";
import {connect, isConnected, subscribe} from "../../helpers/stomp";
import Challenge from "../../models/Challenge";

const WinningImages = () => {
  const [imgs, setImgs] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const goMain = async () => {
    localStorage.removeItem("lobbyId");
    navigate("landingPage");
  };
  const goToScores = async () => {
    navigate(`/lobbies/${lobbyId}/finalResult`, {
      state: { currentRound: state.currentRound },
    });
  };

  const goToExhibition = async () => {
    navigate(`/lobbies/${lobbyId}/exhibitionPage`, {
      state: { currentRound: state.currentRound },
    });
  };

  const lobbyId = localStorage.getItem("lobbyId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!isConnected()) {
      connect(subscribeLobby);
    }

    function subscribeLobby() {
      subscribe(`/topic/lobbies/${lobbyId}`, (data) => {
        let subscribedPlayers = data["players"];
        localStorage.setItem("curator", subscribedPlayers[0].userName);
        localStorage.setItem("roundDuration", data["roundDuration"]);
        localStorage.setItem("#players", subscribedPlayers.length);
      });
      subscribeChallenge();
    }

    function subscribeChallenge() {
      subscribe(`/topic/lobbies/${lobbyId}/challenges`, (data) => {
        console.log(data);
        const challenge = new Challenge();
        challenge.durationInSeconds = data["durationInSeconds"];
        challenge.styleRequirement = data["styleRequirement"];
        challenge.imagePrompt = data["imagePrompt"];
        challenge.roundNr = data["roundNr"];
        challenge.category = data["category"]
        localStorage.setItem("challengeImage", challenge.imagePrompt.image);
        localStorage.setItem("category", challenge.category);
        localStorage.setItem(
            "challengeStyle",
            challenge.styleRequirement.style
        );
        navigate(`/lobbies/${lobbyId}/games/${challenge.roundNr}`);
      });
    }

    try {
      async function fetch() {
        const response = await api.get(`/lobbies/${lobbyId}/games/winners`);
        console.log(response.data);
        setImgs(response.data);
      }
      fetch();
    } catch (error) {
      console.error(
          `Something went wrong while starting the game: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
          "Something went wrong while fetching the winning images! See the console for details."
      );
    }
  }, [lobbyId, navigate]);

  let imageList = (
    <>
      <Spinner backgroundImage={localStorage.getItem("challengeImage")} />
    </>
  );
  if (imgs) {
    imageList = (
      <div className=" exhibition image-container">
        {imgs.map((image) => (
          <ImageComponent
            className="exhibition"
            url={true}
            image={image.image}
          />
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
        <Button className="E" onClick={() => goToExhibition()}>
          Visit Exhibition
        </Button>
        <Button className="E" onClick={() => goToScores()}>
          Scoreboard
        </Button>
        <Button className="E" onClick={() => goMain()}>
          Logout
        </Button>
      </div>
    </LobbyContainer>
  );
};

export default WinningImages;
