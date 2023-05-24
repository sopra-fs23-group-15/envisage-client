import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import { disconnect, isConnected } from "helpers/stomp";
import "styles/views/Login.scss";
import { AlertMessage } from "../ui/AlertMessage";
import { ManifestoBanner } from "components/ui/ManifestoBanner";

const NumberInput = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [alert, setAlert] = useState(<div className="alertMsg"></div>);

  const handleInputChange = (event) => {
    const regex = /^\d*\s*$/;
    const inputValue = event.target.value;

    if (inputValue === "" || regex.test(inputValue)) {
      setInputValue(inputValue);
      props.onChange(inputValue);
    } else {
      setAlert(<AlertMessage error={"Please enter only numbers."} alert={setAlert} alert={setAlert}/>);
      console.log(alert);
    }
  };

  return (
    <div className="login field">
      {alert}
      <label className="login label">{props.label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="login input"
        placeholder={props.placeholder}
      />
    </div>
  );
};

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
  const [alert, setAlert] = useState(<div className="alertMsg"></div>);

  useEffect(() => {
    if (isConnected()) {
      disconnect();
    }
  });
  const setLobbyPin = (pin) => {
    setLobbyId(pin);
  };
  const addUser = async () => {
    try {
      const requestBody = JSON.stringify({ userName });
      console.log(requestBody);
      const response = await api.post(`/lobbies/${lobbyId}`, requestBody);
      console.log(response.data);
      console.log("Connected Lobbies: " + isConnected());
      localStorage.setItem("userName", userName);
      localStorage.setItem("lobbyId", parseInt(lobbyId));
      navigate(`/lobbies/${lobbyId}`);
    } catch (error) {
      setAlert(<AlertMessage error={`Something went wrong when trying to join the lobby: \n${handleError(error)}`} alert={setAlert}/>);
    }
  };

  return (
    <BaseContainer>
      <Slider />
      <div className="login container">
        <div>Welcome to Envisage</div>
        <div>Drawing is describing</div>
        <div>Join a game now</div>
        <div className="login form-container">
          <NumberInput
            label="please enter a game pin"
            value={lobbyId}
            placeholder="game pin"
            onChange={(id) => setLobbyPin(id)}
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
      <ManifestoBanner/>
    </BaseContainer>
  );
};

export default LandingPage;
