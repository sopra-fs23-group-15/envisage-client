import React, {useEffect, useState} from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import "styles/views/Login.scss";
import {disconnect, isConnected} from "helpers/stomp";

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

const LandingPage = () => {
  const [userName, setUsername] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("connected LandingPage before: " + isConnected())
    if (isConnected()){
    disconnect();
    }
    console.log("connected LandingPage after: " + isConnected())
  })


  const addUser = async () => {
    try {
      const requestBody = JSON.stringify({ userName });
      const response = await api.post(`/lobbies/${lobbyId}`, requestBody);
      console.log(response.data);
      console.log("Connected Lobbies: " + isConnected());
      localStorage.setItem("player", userName);
      localStorage.setItem("lobbyId", parseInt(lobbyId));
      navigate(`/lobbies/${lobbyId}`);
    } catch (error) {
      alert(
        `Something went wrong when joining the lobby: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <Slider />
      <div className="login container">
        <div>Welcome to Envisage</div>
        <div>Join a game now</div>
        <div className="login form-container">
          <FormField
            label="please enter a game pin"
            value={lobbyId}
            placeholder="game pin"
            onChange={(id) => setLobbyId(id)}
          />
          <FormField
            label="please enter a username"
            value={userName}
            placeholder="username"
            type="text"
            onChange={(un) => setUsername(un)}
          />
        </div>
        <div className="login button-container">
          <Button disabled={!userName || !lobbyId} onClick={() => addUser()}>
            Continue
          </Button>
          <div className="login label">or</div>
          <Button onClick={() => navigate(`/lobbyCreation`)}>
            Create a lobby and invite friends
          </Button>
        </div>
      </div>
      <div className="login manifesto">
        Compete with friends your AI generated masterpieces
      </div>
    </BaseContainer>
  );
};

export default LandingPage;
