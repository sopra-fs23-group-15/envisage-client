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
import {Collapse} from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const LobbiesAfter = () => {
  const navigate = useNavigate();
  const [playerScores, setPlayerScores] = useState(null);
  const [winner, setWinner] = useState("");
  const { lobbyId } = useParams();
  const { state } = useLocation();
  const [currentRound, setCurrentRound] = useState(null);
  const [allvotes, setAllvotes] = useState(false);
  let [alert, setAlert] = useState(<div className="alertMsg"></div>);
  let [open, setOpen] = useState(true);

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
          `something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("details:", error);
        setAlert(
            <Collapse in={open}>
              <Alert className="alertMsg" severity="error" action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>}>
                Something went wrong while fetching the users! see the console for details.
              </Alert>
            </Collapse>
        );
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
      setAlert(
          <Collapse in={open}>
            <Alert className="alertMsg" severity="error" action={
              <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>}>
              Something went wrong while initiating the next round! See the console for details.
            </Alert>
          </Collapse>
      );
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

    playersList = (
      <div>
        <LobbyBanner
          players={playerScores}
          curator={localStorage.getItem("curator")}
        />
        <div className="player down">
          <div className="player round">Round {state.currentRound}</div>
          <div className="player left">
            {playerScores.map((playerScore) => (
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
            <div
              className="player special"
              style={
                allvotes
                  ? {
                      // visibility: "visible",
                      backgroundImage: "url(" + winner + ")",
                    }
                  : { backgroundImage: "none" }
              }
            >
              Behold the round winner!
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default LobbiesAfter;
