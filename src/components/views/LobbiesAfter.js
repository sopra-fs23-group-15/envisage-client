import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import LobbyBanner from "components/ui/LobbyBanner";
import {
  connect,
  getChallengeForRound,
  isConnected,
  subscribe,
} from "helpers/stomp";
import "styles/views/Player.scss";
import Challenge from "../../models/Challenge";
import {AlertMessage} from "../ui/AlertMessage";

const LobbiesAfter = () => {
  const navigate = useNavigate();
  const [playerScores, setPlayerScores] = useState(null);
  const [winner, setWinner] = useState("");
  const { lobbyId } = useParams();
  const { state } = useLocation();
  const [currentRound, setCurrentRound] = useState(null);
  const [allvotes, setAllvotes] = useState(false);
  let [alert, setAlert] = useState(<div className="alertMsg"></div>);

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
        challenge.category = data["category"];
        localStorage.setItem("challengeImage", challenge.imagePrompt.image);
        localStorage.setItem("category", challenge.category);
        localStorage.setItem(
          "challengeStyle",
          challenge.styleRequirement.style
        );
        navigate(`/lobbies/${lobbyId}/games/${challenge.roundNr}`);
      });
    }

    async function fetchScores() {
      try {
        const scoresResponse = await api.get(`/lobbies/${lobbyId}/games`);
        const winnerResponse = await api.get(
          `/lobbies/${lobbyId}/games/${state.currentRound}/winners`
        );
        setPlayerScores(scoresResponse.data.playerScores);
        setCurrentRound(scoresResponse.data.rounds.length);
        setWinner(winnerResponse.data.image);
        console.log(scoresResponse);

        let votes = 0;
        scoresResponse.data.playerScores.map(
          (playerScore) => (votes = votes + playerScore.score)
        );
        if (
          votes ===
          scoresResponse.data.playerScores.length * state.currentRound
        ) {
          setAllvotes(true);
        }
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("details:", error);
        setAlert(<AlertMessage error={error.response.data.message} alert={setAlert}/>);
      }
    }
    let interval;
    interval = setInterval(fetchScores, 1000);
    return () => clearInterval(interval);
  }, [lobbyId, state.currentRound, navigate]);

  const startGame = async () => {
    try {
      await api.post(`/lobbies/${lobbyId}/games/rounds`);
      getChallengeForRound(
        lobbyId,
        currentRound + 1,
        localStorage.getItem("category")
      );
    } catch (error) {
      console.error(
        `Something went wrong while initiating the next round: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
      setAlert(<AlertMessage error={error.response.data.message} alert={setAlert}/>);
    }
  };

  let playersList = <LobbyContainer />;

  if (playerScores) {
    playerScores.sort((a, b) => b.score - a.score);

    const fillPlayers = () => {
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

    let records = playerScores.map((playerScore) => playerScore.score);
    let noneWinners = records.slice(1).filter((n) => ![records[0]].includes(n));
    let winners = playerScores.slice(
      0,
      playerScores.length - noneWinners.length
    );
    noneWinners = playerScores.filter((n) => !winners.includes(n));

    playersList = (
      <div>
        <LobbyBanner
          players={playerScores}
          curator={localStorage.getItem("curator")}
        />
        <div className="player down">
          <div className="player round">Round {state.currentRound}</div>
          <div className="player left">
            {winners.map((playerScore) => (
              <div className="player row winner">
                <div>{playerScore.player}</div>
                <div>{playerScore.score}</div>
              </div>
            ))}
            {noneWinners.map((playerScore) => (
              <div className="player row">
                <div>{playerScore.player}</div>
                <div>{playerScore.score}</div>
              </div>
            ))}
            {fillPlayers()}
          </div>
          <div className="player right">
            <Button
              disabled={
                localStorage.getItem("userName") !==
                  localStorage.getItem("curator") || !allvotes
              }
              onClick={() => startGame()}
            >
              Start next round
            </Button>
            <div>{alert}</div>
            <div className="player special">
              {allvotes
                ? winners.length === 1
                  ? `This image gets the most votes!`
                  : `We have a tie for the round winner... But this image gets the most votes!`
                : `The round winner will come soon...`}
              <img
                className="player special img"
                style={
                  allvotes
                    ? { visibility: "visible" }
                    : { visibility: "hidden" }
                }
                src={winner}
                alt=""
              />

            </div>
          </div>
        </div>
      </div>
    );
  }
  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default LobbiesAfter;
