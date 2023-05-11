import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
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
import "styles/views/Player.scss";

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
        setCurator(subscribedPlayers[0].userName)
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
      getChallengeForRound(lobbyId, 1);
    } catch (error) {
      console.error(
        `Something went wrong while starting the game: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while starting the game! See the console for details."
      );
    }
  };

  let playersList = <LobbyContainer />;
  let notification = <div/>

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

    if (players.length > 1 && localStorage.getItem("curator") !== localStorage.getItem("userName")){
        notification = (<div>Wait for the lobby creator to start the game</div>)
    }
    else{
        notification = (<div>Fill this wall with your masterpieces</div>)
    }

    playersList = (
      <div>
        <LobbyBanner players={players} curator={curator}/>
        <div className="player down">
          <div className="player round">Round 0</div>
          <div className="player left">
            {players.map((player) => (
              <div className="player row">
                <div>{player.userName}</div>
                <div>0</div>
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
            {notification}
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default Lobbies;
