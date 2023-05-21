import React, { useState } from "react";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import Slider from "components/ui/Slider";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Player from "models/Player";
import Lobby from "models/Lobby";

const options_rounds = [
  "1 round",
  "2 rounds",
  "3 rounds",
  "4 rounds",
  "5 rounds",
];

const min_time = 10,
  max_time = 90,
  interval = 10;

const options_category = [
  "random",
  "abstract art",
  "landscape",
  "portrait",
  "postcard",
  "still life",
];

const LobbyConfiguration = () => {
  const userName = localStorage.getItem("userName");
  const rounds = useState("");
  const [currentTimer, setCurrentTimer] = useState(60);
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState(2);
  const [currentRounds, setCurrentRounds] = useState(2);

  const createLobby = () => {
    localStorage.setItem("category", options_category[currentCategory]);

    try {
      const roundDurationInSeconds = currentTimer;
      const noOfRounds = options_rounds[currentRounds].split(" ")[0];
      const requestBody = JSON.stringify({
        roundDurationInSeconds,
        noOfRounds,
      });
      api.post("/lobbies", requestBody).then(async function (response) {
        const r = await api.get(`/lobbies`);
        console.log(r);
        const lobby = new Lobby(response.data);
        const lobbyId = lobby.pin;

        localStorage.setItem("lobbyId", parseInt(lobbyId));
        console.log("LobbyId in Storage: " + localStorage.getItem("lobbyId"));
        await addPlayer(lobbyId);
      });
    } catch (error) {
      alert(
        `Something went wrong when joining the lobby: \n${handleError(error)}`
      );
    }
  };

  const addPlayer = async (lobbyId) => {
    try {
      const requestBody = JSON.stringify({ userName });
      const response = await api.post(`/lobbies/${lobbyId}`, requestBody);

      const player = new Player(response.data);
      localStorage.setItem("player", JSON.stringify(player));
      localStorage.setItem("creator", player.lobbyCreator);
      localStorage.setItem("lobbyID", parseInt(lobbyId));

      navigate(`/lobbies/${lobbyId}`);
    } catch (error) {
      alert(
        `Something went wrong when joining the lobby: \n${handleError(error)}`
      );
    }
  };

  const decreaseRounds = () => {
      setCurrentRounds(currentRounds-1);
  };

  const increaseRounds = () => {
      setCurrentRounds(currentRounds+1);
  };

  const decreaseCategory = () => {
      setCurrentCategory(currentCategory-1);
  };

  const increaseCategory = () => {
      setCurrentCategory(currentCategory+1);
  };

  const decreaseTimer = () => {
      setCurrentTimer(currentTimer-interval);
  };

  const increaseTimer = () => {
      setCurrentTimer(currentTimer+interval);
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div>Welcome to Envisage</div>
        <div>Drawing is describing</div>
        <div>Join a game now</div>
        <div className="login selectiontitle">
          please choose an image category
        </div>
        <div className="login selector">
          <Button
            className="L L"
            disabled={currentCategory === 0}
            onClick={() => decreaseCategory()}
          >
            ❮
          </Button>
          <div> {options_category[currentCategory]} </div>
          <Button
            className="L R"
            disabled={currentCategory === options_category.length-1}
            onClick={() => increaseCategory()}
          >
            ❯
          </Button>
        </div>
        <div className="login selectiontitle">
          please set the number of rounds
        </div>
        <div className="login selector">
          <Button
            className="L L"
            disabled={currentRounds === 0}
            onClick={() => decreaseRounds()}
          >
            -
          </Button>
          <div> {options_rounds[currentRounds]} </div>
          <Button
            className="L R"
            disabled={currentRounds === options_rounds.length-1}
            onClick={() => increaseRounds()}
          >
            +
          </Button>
        </div>
        <div className="login selectiontitle">
          please set the timer
        </div>
        <div className="login selector">
          <Button
            className="L L"
            disabled={currentTimer === min_time}
            onClick={() => decreaseTimer()}
          >
            -
          </Button>
          <div> {currentTimer + " seconds"} </div>
          <Button
            className="L R"
            disabled={currentTimer === max_time}
            onClick={() => increaseTimer()}
          >
            +
          </Button>
        </div>
        <Button disabled={!rounds} onClick={() => createLobby()}>
          Save and start a game
        </Button>
      </div>
      <Slider />
      <p className="login manifesto">
        "Captain America jumps into a splash of water, David Hockney style"
        <br />
        How you would draw this in the game : ⇨
      </p>
    </BaseContainer>
  );
};

export default LobbyConfiguration;
