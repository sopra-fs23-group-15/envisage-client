import PropTypes from "prop-types";
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


const options = [
            { value: '1', label: "1 round" },
            { value: '2', label: "2 rounds" },
            { value: '3', label: "3 rounds" },
            { value: '4', label: "4 rounds" }
          ];

const LobbyConfiguration = () => {
    const userName = localStorage.getItem('userName')
    const [rounds, setRounds] = useState('');
    const navigate = useNavigate();

    const createLobby = () => {
     try {
       const roundDurationInSeconds = 30;
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

    const handleChange = (selectedOption) => {
        setRounds(selectedOption["value"]);
    };


    return (
        <BaseContainer>
            <div className="login container">
                <div>Hello {userName}</div>
                <div>On this page you can configure your lobby</div>
                <div>Set the number of rounds</div>
                <div>
                    <Select className = "login select" options= {options} onChange={handleChange}/>
                </div>
                <Button disabled={!rounds} onClick={() => createLobby()}>
                    Start the game
                </Button>
            </div>
            <Slider />
        </BaseContainer>
    )

}

export default LobbyConfiguration;