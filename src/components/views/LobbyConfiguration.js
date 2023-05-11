import React, { useState } from "react";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import Slider from "components/ui/Slider";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Player from "models/Player";
import Lobby from "models/Lobby";
import Select from "react-select";

const options_rounds = [
  { value: "1", label: "1 round" },
  { value: "2", label: "2 rounds" },
  { value: "3", label: "3 rounds" },
  { value: "4", label: "4 rounds" },
];

const options_time = [
  { value: "10", label: "10 seconds" },
  { value: "20", label: "20 seconds" },
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "90", label: "1.5 minutes" },
];

const LobbyConfiguration = () => {
  const userName = localStorage.getItem("userName");
  const [rounds, setRounds] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  const createLobby = () => {
    try {
      const roundDurationInSeconds = time;
      const noOfRounds = rounds;
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

  const handleChangeRounds = (selectedOption) => {
    setRounds(selectedOption["value"]);
  };

  const handleChangeTime = (selectedOption) => {
    setTime(selectedOption["value"]);
  };


    return (
        <BaseContainer>
            <div className="login container">
                <div>Welcome to Envisage</div>
                <div>Join a game now</div>
                <div className="login selectiontitle">Please set the number of rounds</div>
                <div className="login selectionbar">
                    <Select className = "login react-select-container"
                    options= {options_rounds}
                    onChange={handleChangeRounds}
                    theme={(theme) => ({
                       ...theme,
                       borderRadius: 0,
                       colors: {
                         ...theme.colors,
                         primary25: 'gainsboro',
                         primary: 'rebeccaPurple',
                       },
                     })}/>
                </div>
                <div className="login selectiontitle">Please set the timer for each round</div>
                <div className="login selectionbar">
                    <Select className="login react-select-container"
                    options= {options_time}
                    onChange={handleChangeTime}
                    theme={(theme) => ({
                       ...theme,
                       borderRadius: 0,
                       colors: {
                         ...theme.colors,
                         primary25: 'gainsboro',
                         primary: 'rebeccaPurple',
                       },
                     })}/>
                </div>
                <Button disabled={!rounds} onClick={() => createLobby()}>
                    Save and start a game
                </Button>
            </div>
            <Slider />
        </BaseContainer>
    )

}

export default LobbyConfiguration;
