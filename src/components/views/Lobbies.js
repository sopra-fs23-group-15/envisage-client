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
import Game from "models/Game";
import Challenge from "models/Challenge";
import "styles/views/Player.scss";

const Lobbies = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(null);
  const { lobbyId } = useParams();

  useEffect(() => {
    console.log("Connected Lobbies: " + isConnected());

    if (!isConnected()) {
      connect(subscribeLobby);
      //new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>subscribeLobby());
    } else {
      subscribeLobby();
    }

    function subscribeLobby() {
      subscribe(`/topic/lobbies/${lobbyId}`, (data) => {
        let players2 = data["players"];
        setPlayers(players2);
        console.log(players2);
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
        localStorage.setItem("challengeImage", challenge.imagePrompt.image);
        console.log(localStorage.getItem("challengeImage"));
        localStorage.setItem(
          "challengeStyle",
          challenge.styleRequirement.style
        );
        localStorage.setItem("challengeDuration", challenge.durationInSeconds);
        const roundId = 1;
        navigate(`/lobbies/${lobbyId}/games/${roundId}`);
      });
    }
    /**
    async function fetchlobby() {
      try {
        const response = await api.get("/lobbies/" + lobbyId);
        //setPlayers(response.data.players);
      } catch (error) {
        console.error(
          `something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("details:", error);

        alert(
          "something went wrong while fetching the users! see the console for details."
        );
      }
    }
    fetchlobby();**/
  }, [lobbyId, navigate]);

  const startGame = async () => {
    try {
      const response = await api.post("/lobbies/" + lobbyId + "/games");
      const game = new Game(response.data);
      console.log(game);
      //const roundId = game.rounds.length;
      getChallengeForRound(lobbyId, 1);
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

  let playersList = <LobbyContainer />;

  if (players) {
    const fillPlayes = () => {
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
        <LobbyBanner players={players} />
        <div className="player down">
          <div className="player round">Round 0</div>
          <div className="player left">
            {players.map((player) => (
              <div className="player row">
                <div>{player.userName}</div>
                <div>0</div>
              </div>
            ))}
            {fillPlayes()}
          </div>
          <div className="player right">
            <Button disabled={players.length < 3} onClick={() => startGame()}>
              Start the game
            </Button>
            <div>Fill this wall with your masterpieces</div>
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default Lobbies;
