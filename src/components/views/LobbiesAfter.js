import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import LobbyBanner from "components/ui/LobbyBanner";
import Challenge from "models/Challenge";
import {
  connect,
  getChallengeForRound,
  isConnected,
  notifyLobbyJoin,
  subscribe,
} from "helpers/stomp";
import "styles/views/Player.scss";

const LobbiesAfter = () => {
  const navigate = useNavigate();
  const [playerScores, setPlayerScores] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const { lobbyId } = useParams();

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await api.get(`/lobbies/${lobbyId}/games/`);
        setPlayerScores(response.data.playerScores);
        setCurrentRound(response.data.rounds.length);
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

    // function subscribeChallenge() {
    //   subscribe(`/topic/lobbies/${lobbyId}/challenges`, (data) => {
    //     console.log(data);
    //     const challenge = new Challenge();
    //     challenge.durationInSeconds = data["durationInSeconds"];
    //     challenge.styleRequirement = data["styleRequirement"];
    //     challenge.imagePrompt = data["imagePrompt"];
    //     localStorage.setItem("challengeImage", challenge.imagePrompt.image);
    //     console.log(localStorage.getItem("challengeImage"));
    //     localStorage.setItem(
    //       "challengeStyle",
    //       challenge.styleRequirement.style
    //     );
    //     localStorage.setItem("challengeDuration", challenge.durationInSeconds);
    //     const roundId = 1;
    //     navigate(`/lobbies/${lobbyId}/games/${currentRound + 1}`);
    //   });
    // }

    fetchScores();
  }, [lobbyId]);

  const startGame = async () => {
    try {
      await api.post(`/lobbies/${lobbyId}/games/rounds`);
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
        <LobbyBanner players={playerScores} />
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
            <div>Fill this wall with your masterpieces</div>
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default LobbiesAfter;
