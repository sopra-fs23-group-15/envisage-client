import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import { Spinner } from "components/ui/Spinner";
import "styles/views/Player.scss";
import {
  connect,
  getChallengeForRound,
  isConnected,
  subscribe,
} from "helpers/stomp";
import Challenge from "../../models/Challenge";

const FinalPage = () => {
  const [playerScores, setPlayerScores] = useState(null);
  const [allvotes, setAllvotes] = useState(false);
  const { lobbyId } = useParams();
  const { state } = useLocation();

  const navigate = useNavigate();

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
        console.log(subscribedPlayers);
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

    async function fetchScores() {
      try {
        const response = await api.get("/lobbies/" + lobbyId + "/games");
        setPlayerScores(response.data.playerScores);

        let votes = 0;
        response.data.playerScores.map(
          (playerScore) => (votes = votes + playerScore.score)
        );
        if (votes === response.data.playerScores.length * state.currentRound) {
          setAllvotes(true);
        }
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
    let interval;
    interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, [lobbyId, state.currentRound]);

  const visitNext = async () => {
    navigate(`/lobbies/${lobbyId}/exhibitionPage`, {
      state: { currentRound: state.currentRound },
    });
  };

  const visitWinningImages = async () => {
    navigate(`/lobbies/${lobbyId}/winningimages`, {
      state: { currentRound: state.currentRound },
    });
  };

  const goMain = async () => {
    localStorage.removeItem("lobbyId");
    navigate("landingPage");
  };

  const restartGame = async () => {
    try {
      await api.post("/lobbies/" + lobbyId + "/games/restarts");
      getChallengeForRound(lobbyId, 1, localStorage.getItem("category"));
    } catch (error) {
      console.error(
        `Something went wrong while starting the game: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while restarting the game! See the console for details."
      );
    }
  };

  let playersList = (
    <>
      <Spinner
        backgroundImage={"url(img/lobbyLg)"}
        manifesto="Leaderboard after final round comes in 5 seconds"
      />
    </>
  );

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
        <div
          className="player winner"
          style={
            allvotes ? { visibility: "visible" } : { visibility: "hidden" }
          }
        >
          {playerScores[0].player === playerScores[1].player ||
          (playerScores[0].player === playerScores[1].player) ===
            playerScores[2].player
            ? `Congratulations to our multiple winners, what a day!`
            : `Congratulations! ${playerScores[0].player} is our winner`}
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
            <Button className="E" onClick={() => visitNext()}>
              Visit Exhibition
            </Button>
            <Button className="E" onClick={() => visitWinningImages()}>
              See Winning Images
            </Button>
            <Button
              disabled={
                localStorage.getItem("userName") !==
                localStorage.getItem("curator")
              }
              className="E"
              onClick={() => restartGame()}
            >
              Restart a game
            </Button>
            <Button className="E" onClick={() => goMain()}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default FinalPage;
