import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import LobbyBanner from "components/ui/LobbyBanner";
import "styles/views/Player.scss";
import {
  connect,
  getPlayers,
  isConnected,
  subscribe,
} from "../../helpers/stomp";
import Game from "models/Game";

const Lobbies = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(null);
  const { lobbyId } = useParams();

  useEffect(() => {
    console.log("Connected Lobbies: " + isConnected());
    if (!isConnected()) {
      connect(lobbyId);
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        subscribeLobby()
      );
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        getPlayers(lobbyId)
      );
    } else {
      subscribeLobby();
      getPlayers(lobbyId);
    }

    function subscribeLobby() {
      subscribe(`/topic/lobbies/${lobbyId}`, fetchlobby());
    }
    async function fetchlobby() {
      try {
        const response = await api.get("/lobbies/" + lobbyId);
        setPlayers(response.data.players);
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
    fetchlobby();
  }, [lobbyId]);

  const startGame = async () => {
    try {
      const response = await api.post("/lobbies/" + lobbyId + "/games");
      const game = new Game(response.data);
      const roundId = game.rounds.length;
      navigate(`/lobbies/${lobbyId}/games/${roundId}`);
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
