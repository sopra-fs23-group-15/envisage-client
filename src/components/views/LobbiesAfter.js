import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import LobbyBanner from "components/ui/LobbyBanner";
import "styles/views/Player.scss";

const LobbiesAfter = () => {
  const navigate = useNavigate();
  const [playerScores, setPlayerScores] = useState(null);
  const [sortedPlayerScores, setSortedPlayerScores] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const { lobbyId } = useParams();

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await api.get("/lobbies/" + lobbyId + "/games");
        setPlayerScores(response.data.playerScores);
        setCurrentRound(response.data.rounds.length);

        const sortedScores = playerScores.sort((a, b) => b.score - a.score);
        setSortedPlayerScores(sortedScores);
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
    fetchScores();
  }, [lobbyId, playerScores]);

  const startGame = async () => {
    try {
      await api.post("/lobbies/" + lobbyId + "/games/rounds");
      navigate(`/lobbies/${lobbyId}/games/${currentRound + 1}`);
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

  if (playerScores) {
    const fillPlayes = () => {
      const rows = [];
      for (let i = 0; i < 5 - playerScores.length; i++) {
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
        <LobbyBanner players={sortedPlayerScores.players} />
        <div className="player down">
          <div className="player round">Round {currentRound}</div>
          <div className="player left">
            {sortedPlayerScores.map((playerScore) => (
              <div className="player row">
                <div>{playerScore.player.userName}</div>
                <div>{playerScore.score}</div>
              </div>
            ))}
            {fillPlayes()}
          </div>
          <div className="player right">
            <Button
              disabled={
                /*localStorage.getItem("player") !=
                  localStorage.getItem("curator") ||*/ players.length < 3
              }
              onClick={() => startGame()}
            >
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

export default LobbiesAfter;
