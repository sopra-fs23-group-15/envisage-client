import { useNavigate, useLocation } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import { Button } from "components/ui/Button";
import React, { useEffect, useState } from "react";
import { Spinner } from "components/ui/Spinner";
import ImageComponent from "./Image";

import "styles/views/Exhibition.scss";
import {api, handleError} from "helpers/api";
import {connect, isConnected, subscribe, unsubscribe} from "../../helpers/stomp";
import Challenge from "../../models/Challenge";
import {AlertMessage} from "../ui/AlertMessage";

const WinningImages = () => {
  const [imgs, setImgs] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  let [alert, setAlert] = useState(<div className="alertMsg"></div>);

  const goMain = () => {
    try{
      api.delete(`/lobbies/${lobbyId}/${localStorage.getItem("userName")}`)
    } catch (error) {
      console.error(
          `Something went wrong when leaving the game: \n${handleError(error)}`
      );
      console.error("Details:", error);
      setAlert(<AlertMessage error={`Something went wrong when leaving the game: \n${handleError(error)}`}/>);
    }
    localStorage.removeItem("curator");
    localStorage.removeItem("roundDuration");
    localStorage.removeItem("#players");
    localStorage.removeItem("challengeImage");
    localStorage.removeItem("category");
    localStorage.removeItem("userName");
    localStorage.removeItem("lobbyId");
    localStorage.removeItem("player");
    unsubscribe(`/topic/lobbies/${lobbyId}/challenges`);
    unsubscribe(`/topic/lobbies/${lobbyId}`);
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
          `Something went wrong when fetching the winning images: \n${handleError(error)}`
      );
      console.error("Details:", error);
      setAlert(<AlertMessage error={`Something went wrong when fetching the winning images: \n${handleError(error)}`}/>);
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
            Hello <span>{userName}</span>! Welcome to the house of honors!
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
