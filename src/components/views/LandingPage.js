import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import { disconnect, isConnected } from "helpers/stomp";
import "styles/views/Login.scss";

const NumberInput = (props) => {
  const [inputValue, setInputValue] = useState("");
  // const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    // const regex = /^[0-9]*$/; // regex to allow only numbers
    const regex = /^[0-9]*\s*$/;
    const inputValue = event.target.value;
    // if (regex.test(input)) {
    //   setInputValue(input);
    //   setShowAlert(false);
    // } else {
    //   setShowAlert(true);
    // }

    if (inputValue === "" || regex.test(inputValue)) {
      setInputValue(inputValue);
      props.onChange(inputValue);
    }
    // else if (inputValue.length === 1) {
    //   setInputValue("");
    //   alert("Please enter only numbers");
    else {
      // setInputValue(inputValue);
      alert("Please enter only numbers");
    }
  };

  // const handleCloseAlert = () => {
  //   setShowAlert(false);
  // };

  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="login input"
        placeholder={props.placeholder}
      />
      {/* {showAlert && (
        alert("Please enter only numbers"
          // <button onClick={handleCloseAlert}>X</button>
        )
      )} */}
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
      <div className="login manifesto">
        Compete with friends your AI generated masterpieces
      </div>
    </BaseContainer>
  );
};

export default LandingPage;
