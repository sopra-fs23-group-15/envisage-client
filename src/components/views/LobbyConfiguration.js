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

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder={props.placeholder}
        value={props.value}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const LobbyConfiguration = () => {
    const userName = localStorage.getItem('userName')
    const [rounds, setRounds] = useState(null);
    const navigate = useNavigate();

     const createLobby = () => {
        try {
          const roundDurationInSeconds = 30;
          const requestBody = JSON.stringify({
            roundDurationInSeconds,
            rounds,
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

    return (
        <BaseContainer>
            <div className="login container">
                <div>Hello {userName}</div>
                <div>On this page you can configure your lobby</div>
                <div>
                  <FormField
                    label="Please enter the number of rounds"
                    value={rounds}
                    placeholder="number of rounds"
                    onChange={(r) => setRounds(r)}
                  />
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