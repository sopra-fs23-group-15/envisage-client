import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "components/ui/Button";
import LobbyContainer from "components/ui/LobbyContainer";
import LobbyBanner from "components/ui/LobbyBanner";
import {
  connect,
  getChallengeForRound,
  isConnected,
  notifyLobbyJoin,
  subscribe,
} from "helpers/stomp";
import Challenge from "models/Challenge";
import { Notification } from "components/ui/Notification";
import "styles/views/Player.scss";
import Alert from '@mui/material/Alert';

const Lobbies = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(null);
  const [curator, setCurator] = useState(null);
  const { lobbyId } = useParams();

  useEffect(() => {
    console.log("Connected Lobbies: " + isConnected());

    if (!isConnected()) {
      connect(subscribeLobby);
    } else {
      subscribeLobby();
    }

    function subscribeLobby() {
      subscribe(`/topic/lobbies/${lobbyId}`, (data) => {
        let subscribedPlayers = data["players"];
        setPlayers(subscribedPlayers);
        setCurator(subscribedPlayers[0].userName);
        localStorage.setItem("curator", subscribedPlayers[0].userName);
        localStorage.setItem("roundDuration", data["roundDuration"]);
        localStorage.setItem("#players", subscribedPlayers.length);
        console.log(subscribedPlayers);
      });
      notifyLobbyJoin(lobbyId);
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
        localStorage.setItem("challengeImage", challenge.imagePrompt.image);
        console.log(localStorage.getItem("challengeImage"));
        localStorage.setItem(
          "challengeStyle",
          challenge.styleRequirement.style
        );
        localStorage.setItem("challengeDuration", challenge.durationInSeconds);
        navigate(`/lobbies/${lobbyId}/games/${challenge.roundNr}`);
      });
    }
  }, [lobbyId, navigate]);

  const startGame = async () => {
    try {
      await api.post("/lobbies/" + lobbyId + "/games");
      getChallengeForRound(lobbyId, 1, localStorage.getItem("category"));
    } catch (error) {
       console.error(`Something went wrong while starting the game: \n${handleError(error)}`);
       console.error("Details:", error);
       return (<Alert>Something went wrong while starting the game! See the console for details.</Alert>);
    }
  };

  let playersList = <LobbyContainer />;

  if (players) {
    const fillPlayers = () => {
      const rows = [];
      for (let i = 0; i < 5 - players.length; i++) {
        rows.push(
          <div className="player row">
            <div></div>
            <div></div>
          </div>
        );
      }
      return rows;
    };

    playersList = (
      <div>
        <LobbyBanner players={players} curator={curator} />
        <div className="player down">
          <div className="player round">Round 0</div>
          <div className="player left">
            {players.map((player) => (
              <div className="player row">
                <div
                  style={{
                    color: "#666",
                    fontSize: "1rem",
                  }}
                >
                  {player.userName}
                </div>
                <div
                  style={{
                    color: "#666",
                    fontSize: "1rem",
                  }}
                >
                  0
                </div>
              </div>
            ))}
            {fillPlayers()}
          </div>
          <div className="player right">
            <Button
              disabled={
                localStorage.getItem("userName") !==
                  localStorage.getItem("curator") || players.length < 3
              }
              onClick={() => startGame()}
            >
              Start the game
            </Button>
            <Notification players={players} />
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default Lobbies;
