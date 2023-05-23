import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import { disconnect, isConnected } from "helpers/stomp";
import "styles/views/Login.scss";
import Alert from "@mui/material/Alert";
import {Collapse} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const NumberInput = (props) => {
  const [inputValue, setInputValue] = useState("");
  let [alert, setAlert] = useState(<div className="alertMsg"></div>);
  let [open, setOpen] = useState(true);
  const handleInputChange = (event) => {
    const regex = /^\d*\s*$/;
    const inputValue = event.target.value;

    if (inputValue === "" || regex.test(inputValue)) {
      setInputValue(inputValue);
      props.onChange(inputValue);
      setAlert(<div className="alertMsg"></div>);
      setOpen(true);
    } else {
      setAlert(
          <Collapse in={open}>
        <Alert className="alertMsg" severity="error" action={
          <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>}>
          Please enter only numbers.
        </Alert>
          </Collapse>
      );
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
  let [alert, setAlert] = useState(<div className="adduser alert"></div>);
  let [open, setOpen] = useState(true);

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
      // reset the Alert to an empty div
      setAlert(<div className="alertMsg"></div>);
      setOpen(true);
      navigate(`/lobbies/${lobbyId}`);
    } catch (error) {
      setAlert(
          <Collapse in={open}>
        <Alert className="adduser alert" severity="error" action={
          <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>}>
          >{`Something went wrong when joining the lobby: \n${handleError(
            error
        )}`}
        </Alert>
      </Collapse>);
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
      <p className="login manifesto">How you would draw this in the game : ⇨</p>
      {alert}
    </BaseContainer>
  );
};

export default LandingPage;
