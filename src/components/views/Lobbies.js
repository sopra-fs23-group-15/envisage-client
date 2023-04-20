import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import "styles/views/Player.scss";
import {connect, getPlayers, isConnected, subscribe} from "../../helpers/stomp";

const Lobbies = () => {
  const history = useHistory();
  // const [lobby, setLobby] = useState(null);
  const [players, setPlayers] = useState(null);
  const [game, setGame] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    console.log("Connected Lobbies: " + isConnected())
    if (!isConnected()){
      connect(id);
      new Promise((resolve) => setTimeout(resolve, 1000)).then(r =>subscribeLobby())
      new Promise((resolve) => setTimeout(resolve, 1000)).then(r =>getPlayers(id))

    }
    else{
      subscribeLobby()
      getPlayers(id)

    }

    function subscribeLobby(){
      subscribe(`/topic/lobbies/${id}`, fetchlobby()
       );


    }
    async function fetchlobby() {
      try {
        const response = await api.get("/lobbies/" + id);
        console.log(response);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        //setlobby(response.data);
        setPlayers(response.data.players);
        setGame(response.data.game);
      } catch (error) {
        // console.error(
        //   `something went wrong while fetching the users: \n${handleerror(
        //     error
        //   )}`
        // );
        console.error("details:", error);
        alert(
            "something went wrong while fetching the users! see the console for details."
        );
      }
    }
    fetchlobby();

  }, [id]);



  const startGame = async () => {
    await api.post("/lobbies/" + id + "/games");
    history.push("/gamePage");
  };

  let playersList = <LobbyContainer />;

  if (players) {
    const fillPlayes = () => {
      const rows = [];
      for (let i = 0; i < 5 - players.length; i++) {
        rows.push(
          <div className="player row">
            <div></div>
            <div></div>
          </div>
        );
      }
      return rows;
    };

    playersList = (
      <div>
        <div className="player up">
          <h3>
            You are in the <span>{id}</span> museum space
          </h3>
          <h3>
            You exhibition curator is: <span>{players[0].userName}</span>
          </h3>
          <h5 style={players.length > 2? {visibility: "hidden"} : {visibility: "visible"}}>
            Please wait for <span>{3 - players.length}</span> more players to
            join
          </h5>
          <h5>
            How to play: <span>icon</span>
          </h5>
        </div>

        <div className="player down">
          <div className="player round">Round {game? "#" : 0}</div>
          <div className="player left">
            {players.map((player) => (
              <div className="player row">
                <div key={player.id}>{player.userName}</div>
                <div key={player.id}>
                  {game ? game.playerScores[player.userName] : 0}
                </div>
              </div>
            ))}
            {fillPlayes()}
          </div>
          <div className="player right">
            <Button disabled={players.length < 3} onClick={() => startGame()}>
              Start the game
            </Button>
            <div>Fill this wall with your masterpieces</div>
          </div>
        </div>
      </div>
    );
  }

  return <LobbyContainer>{playersList}</LobbyContainer>;
};

export default Lobbies;
