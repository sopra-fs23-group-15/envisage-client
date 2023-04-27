import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import "styles/views/Player.scss";

const FinalPage = () => {
  const [playerScores, setPlayerScores] = useState(null);
  const { lobbyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await api.get("/lobbies/" + lobbyId + "/games");
        setPlayerScores(response.data.playerScores);
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
  }, [lobbyId]);

  const visitNext = async () => {
    navigate(`/lobbies/${lobbyId}/exhibitionPage`);
  };

  let playersList = <LobbyContainer />;

  if (playerScores) {
    playerScores.sort((a, b) => b.score - a.score);
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
        <div className="player winner">
          The winner of the game is {playerScores[0].player}.
          Congratulations!
        </div>
        <div className="player down">
          <div className="player round"></div>
          <div className="player left">
            {playerScores.map((playerScore) => (
              <div className="player row">
                <div>{playerScore.player}</div>
                <div>{playerScore.score}</div>
              </div>
            ))}
            {fillPlayes()}
          </div>
          <div className="player right">
            <Button onClick={() => visitNext()}>Visit Exhibition</Button>
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default FinalPage;
