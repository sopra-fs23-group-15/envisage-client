import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import "styles/views/Login.scss";
import User from "models/User";
import Lobby from "../../models/Lobby";

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
  const [userName, setUsername] = useState(null);
  const history = useHistory();

  const createLobby = async () => {
    try {
      const response = await api.post('/lobbies');
      console.log(response.data)
      const lobby = new Lobby (response.data);
      const lobbyId = lobby.pin;
      console.log(lobbyId)

      addUser(lobbyId);
    } catch (error) {
      alert(
        `Something went wrong when joining the lobby2: \n${handleError(error)}`
      );
    }
  };

  const addUser = async (lobbyId) => {
    try {
      console.log(lobbyId)
      const requestBody = JSON.stringify({ userName });
      const response = await api.post(`lobbies/${lobbyId}`, requestBody);

      const user = new User(response.data);

      localStorage.setItem("token", user.token);

      history.push(`lobbies/${lobbyId}`);
    } catch (error) {
      alert(
        `Something went wrong when joining the lobby: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login label">Welcome to Envisage</div>
        <div className="login label">Join a game now</div>
        <div className="login form-container">
          <FormField
            label="please enter lobby creator's name"
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
          <Button onClick={() => history.push(`/landingPage`)}>
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
