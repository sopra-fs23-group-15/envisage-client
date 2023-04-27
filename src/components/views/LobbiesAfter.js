import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useLocation, useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import LobbyBanner from "components/ui/LobbyBanner";
import { getChallengeForRound } from "helpers/stomp";
import "styles/views/Player.scss";

const LobbiesAfter = () => {
  const [playerScores, setPlayerScores] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [winner, setWinner] = useState("");
  const { lobbyId } = useParams();
  const { state } = useLocation();

  useEffect(() => {
    async function fetchScores() {
      try {
        const scoresResponse = await api.get(`/lobbies/${lobbyId}/games`);
        const winnerResponse = await api.get(
          `/lobbies/${lobbyId}/games/${state.currentRound}/winners`
        );
        setPlayerScores(scoresResponse.data.playerScores);
        setCurrentRound(scoresResponse.data.rounds.length);
        setWinner(winnerResponse.data.image);
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
  }, [lobbyId, state.currentRound]);

  const startGame = async () => {
    try {
      await api.post(`/lobbies/${lobbyId}/games/rounds`);
      getChallengeForRound(lobbyId, currentRound + 1);
    } catch (error) {
      console.error(
        `Something went wrong while initiating the next round: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while initiating the next round! See the console for details."
      );
    }
  };

  let playersList = <LobbyContainer />;

  if (playerScores) {
    playerScores.sort((a, b) => b.score - a.score);
    // console.log(playerScores);
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
        <LobbyBanner
          players={playerScores}
          curator={localStorage.getItem("curator")}
        />
        <div className="player down">
          <div className="player round">Round {currentRound}</div>
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
            <Button
              // disabled={
              //   localStorage.getItem("player") !=
              //     localStorage.getItem("curator")
              // }
              onClick={() => startGame()}
            >
              Start the game
            </Button>
            <div
              className="player special"
              style={{ backgroundImage: "url(" + winner + ")" }}
            >
              Round Winner
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default LobbiesAfter;
