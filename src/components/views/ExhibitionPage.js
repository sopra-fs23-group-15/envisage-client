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
import {Collapse} from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ExhibitionPage = () => {
  const [imgs, setImgs] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  let [alert, setAlert] = useState(<div className="alertMsg"></div>);
  let [open, setOpen] = useState(true);

  const goMain = () => {
    try{
      api.delete(`/lobbies/${lobbyId}/${localStorage.getItem("userName")}`)
    } catch (error) {
      console.error(
          `Something went wrong while leaving the game: \n${handleError(error)}`
      );
      console.error("Details:", error);
      setAlert(
          <Collapse in={open}>
            <Alert className="alertMsg" severity="error" action={
              <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>}>
              Something went wrong while leaving the game.
            </Alert>
          </Collapse>
      );
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

  const visitWinningImages = async () => {
    navigate(`/lobbies/${lobbyId}/winningimages`, {
      state: { currentRound: state.currentRound },
    });
  };
  const goToScores = async () => {
    navigate(`/lobbies/${lobbyId}/finalResult`, {
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
        const response = await api.get(
          `/lobbies/${lobbyId}/games/images/${userName}`
        );
        console.log(response.data);
        setImgs(response.data);
      }
      fetch();
    } catch (error) {
      return { error };
    }
  }, [lobbyId, userName, navigate]);

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
            Hello <span>{userName}</span>! Welcome to your solo exhibition
          </h3>
        </>
        <Button className="E" onClick={() => visitWinningImages()}>
          See Winning Images
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

export default ExhibitionPage;
