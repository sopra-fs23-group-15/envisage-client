import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Slider from "components/ui/Slider";
import Player from "models/Player";
import Lobby from "models/Lobby";
import { disconnect, isConnected } from "helpers/stomp";
import "styles/views/Login.scss";
import {Collapse} from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
  let [alert, setAlert] = useState(<div className="alertMsg"></div>);
  let [open, setOpen] = useState(true);

  useEffect(() => {
    if (isConnected()) {
      disconnect();
    }
  });

  const createLobby = () => {
    try {
      const requestBody = JSON.stringify({});
      api.post("/lobbies", requestBody).then(async function (response) {
        const r = await api.get(`/lobbies`);
        console.log(r);
        const lobby = new Lobby(response.data);
        const lobbyId = lobby.pin;
        localStorage.setItem("lobbyId", parseInt(lobbyId));
        console.log("LobbyId in Storage: " + localStorage.getItem("lobbyId"));
        localStorage.setItem("category", "random");
        await addPlayer(lobbyId);
      });
    } catch (error) {
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
              >{`Something went wrong when joining the lobby: \n${handleError(
                error
            )}`}
            </Alert>
          </Collapse>);
    }
  };

  const addPlayer = async (lobbyId) => {
    try {
      const requestBody = JSON.stringify({ userName });
      const response = await api.post(`/lobbies/${lobbyId}`, requestBody);

      const player = new Player(response.data);
      localStorage.setItem("player", JSON.stringify(player));
      localStorage.setItem("userName", userName);
      navigate(`/lobbies/${lobbyId}`);
    } catch (error) {
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
              >{`Something went wrong when joining the lobby: \n${handleError(
                error
            )}`}
            </Alert>
          </Collapse>);
    }
  };

  const configureLobby = () => {
    localStorage.setItem("userName", userName);
    navigate("/lobbyConfiguration");
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div>Welcome to Envisage</div>
        <div>Drawing is describing</div>
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
          <Button disabled={!userName} onClick={() => configureLobby()}>
            Configure your lobby
          </Button>
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
      <p className="login manifesto">
        How you would draw this in the game : ⇨
      </p>
    </BaseContainer>
  );
};

export default LobbyCreation;
