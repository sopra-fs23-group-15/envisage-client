import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import "styles/views/Login.scss";


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

const LandingPage = (props) => {
  const [username, setUsername] = useState(null);
  const [lobbyID, setLobbyID] = useState(null);
  const history = useHistory();

  const joinLobby = async () => {
    try {
      api.get("/lobbies/" + lobbyID);
      addUser();
    } catch (error) {
      alert(
        `Something went wrong when joining the lobby: \n${handleError(error)}`
      );
    }
  };

  const addUser = async () => {
    try {
      const requestBody = JSON.stringify({ username });
      api.post("/users", requestBody);
      api.post("/lobbies/" + lobbyID, requestBody);

      history.push("/lobby/" + lobbyID);
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
            label="please enter a game pin"
            value={lobbyID}
            placeholder="game pin"
            onChange={(id) => setLobbyID(id)}
          />
          <FormField
            label="please enter a username"
            value={username}
            placeholder="username"
            onChange={(un) => setUsername(un)}
          />
        </div>
        <div className="login button-container">
          <Button disabled={!username || !lobbyID} onClick={() => joinLobby()}>
            Continue
          </Button>
          <div className="login label">or</div>
          <Button>Create a lobby and invite friends</Button>
        </div>
      </div>
      <Slider />
      <div className="login manifesto">
        Compete with friends your AI generated masterpieces
      </div>
    </BaseContainer>
  );
};

export default LandingPage;
