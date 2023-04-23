import React, {useEffect, useState} from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import "styles/views/Login.scss";
import Player from "models/Player";
import Lobby from "models/Lobby";
import {disconnect, isConnected} from "../../helpers/stomp";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder={props.placeholder}
        value={props.value}
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

const LobbyCreation = () => {
  const [userName, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("connected LandingPage before: " + isConnected())
    if (isConnected()){
      disconnect();
    }
    console.log("connected LandingPage after: " + isConnected())
  })

  const createLobby = async () => {
    try {
      const RoundDurationInSeconds = 60;
      const NoOfRounds = 5;
      const requestBody = JSON.stringify({ RoundDurationInSeconds,  NoOfRounds});
      const response = await api.post("/lobbies", requestBody);
      const lobby = new Lobby(response.data);
      const lobbyId = lobby.pin;
      localStorage.setItem("lobbyId", parseInt(lobbyId));

      addPlayer(lobbyId);
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

      localStorage.setItem("creator", player.lobbyCreator);
      localStorage.setItem("player", userName);
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
        <div>Welcome to Envisage</div>
        <div>Join a game now</div>
        <div>
          <FormField
            label="please enter a username"
            value={userName}
            placeholder="lobby creator"
            onChange={(un) => setUsername(un)}
          />
        </div>
        <div className="login button-container">
          <Button>Configure your lobby</Button>
          <Button disabled={!userName} onClick={() => createLobby()}>
            Start a default game
          </Button>
          <div className="login label">or</div>
          <Button onClick={() => navigate(`/landingPage`)}>
            Go back to join a game
          </Button>
        </div>
      </div>
      <Slider />
      <div className="login manifesto">
        Compete with friends your AI generated masterpieces
      </div>
    </BaseContainer>
  );
};

export default LobbyCreation;
