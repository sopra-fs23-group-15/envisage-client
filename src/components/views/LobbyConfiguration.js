import React, { useState } from "react";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import Slider from "components/ui/Slider";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Player from "models/Player";
import Lobby from "models/Lobby";

const options_rounds = ["1 round", "2 rounds", "3 rounds",  "4 rounds", "5 rounds"];

const min_time = 10, max_time = 90, interval = 10;

const options_category = ["random", "abstract art", "landscape", "portrait", "postcard", "still life"];

const LobbyConfiguration = () => {
  const userName = localStorage.getItem("userName");
  const rounds = useState("");
  const [currentTimer, setCurrentTimer] = useState(min_time);
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState(2)
    const [currentRounds, setCurrentRounds] = useState(2);

  const createLobby = () => {
      localStorage.setItem("category", options_category[currentCategory]);

      try {
      const roundDurationInSeconds = currentTimer;
      const noOfRounds = currentRounds;
      const requestBody = JSON.stringify({
        roundDurationInSeconds,
        noOfRounds,
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

  const decreaseRounds = () => {
      if(currentRounds===0){
          setCurrentRounds(options_rounds.length-1);
      } else{
          setCurrentRounds(currentRounds-1);
      }
  }

  const increaseRounds = () => {
      if(currentRounds===options_rounds.length-1){
          setCurrentRounds(0);
      } else{
          setCurrentRounds(currentRounds+1);
      }
  }

    const decreaseCategory = () => {
        if(currentCategory===0){
            setCurrentCategory(options_category.length-1);
        } else{
            setCurrentCategory(currentCategory-1);
        }
    }

    const increaseCategory = () => {
        if(currentCategory===options_category.length-1){
            setCurrentCategory(0);
        } else{
            setCurrentCategory(currentCategory+1);
        }
    }

    const decreaseTimer = () => {
        if(currentTimer===min_time){
            setCurrentTimer(max_time);
        } else{
            setCurrentCategory(currentTimer-interval);
        }
    }

    const increaseTimer = () => {
        if(currentTimer===max_time){
            setCurrentTimer(min_time);
        } else{
            setCurrentTimer(currentTimer+interval);
        }
    }

    return (
        <BaseContainer>
            <div className="login container">
                <div>Welcome to Envisage</div>
                <div>Join a game now</div>
                <div></div>
                <div className="login selectiontitle"> Please choose a starting category </div>
                <div className="login selector">
                    <Button onClick={() => decreaseCategory()}> previous </Button>
                    <div> {options_category[currentCategory]} </div>
                    <Button onClick={() => increaseCategory()}> next </Button>
                </div>
                <div className="login selectiontitle"> Please set the number of rounds </div>
                <div className="login selector">
                    <Button onClick={() => decreaseRounds()}>-</Button>
                    <div> {options_rounds[currentRounds]} </div>
                    <Button onClick={() => increaseRounds()}>+</Button>
                </div>
                <div className="login selectiontitle"> Please set the timer for each round </div>
                <div className="login selector">
                    <Button onClick={() => decreaseTimer()}>-</Button>
                    <div> {currentTimer + " seconds"} </div>
                    <Button onClick={() => increaseTimer()}>+</Button>
                </div>
                <Button disabled={!rounds} onClick={() => createLobby()}>
                    Save and start a game
                </Button>
            </div>
            <Slider />
        </BaseContainer>
    )

}

export default LobbyConfiguration;
