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

const LobbyCreation = (props) => {
  const [lobbyCreator, setLobbyCreator] = useState(null);
  const history = useHistory();

  const createLobby = async () => {
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
            label="please enter lobby creator's name"
            value={lobbyCreator}
            placeholder="lobby creator"
            onChange={(lc) => setLobbyCreator(lc)}
          />
        </div>
        <div className="login button-container">
          <Button>Configure your lobby</Button>
          <Button
            disabled={!username || !lobbyID}
            onClick={() => createLobby()}
          >
            Start a default game
          </Button>
          <div className="login label">or</div>
          <Button>Go back to join a game</Button>
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
