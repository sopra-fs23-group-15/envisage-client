import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import LobbyBanner from "components/ui/LobbyBanner";
import "styles/views/Player.scss";
import Game from "models/Game";


const FinalPage = () => {
  const navigate = useNavigate();
  const [playerScores, setPlayerScores] = useState(null);
  const { lobbyId} = useParams();

  useEffect(() => {
    async function fetchScores() {
          try {

            const response = await api.get("/lobbies/" + lobbyId +"/games");
            setPlayerScores(response.data.playerScores);
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
        fetchScores();

      }, [lobbyId]);

      let playersList = <LobbyContainer />;


      if (playerScores) {
          const fillPlayes = () => {
            const rows = [];
            for (let i = 0; i < 5 - playerScores.length; i++) {
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
              <div className="player down">
                <div className="player round">Round 0</div>
                <div className="player left">
                  {playerScores.map((playerScore) => (
                    <div className="player row">
                      <div>{playerScore.player}</div>
                      <div>{playerScore.score}</div>
                    </div>
                  ))}
                  {fillPlayes()}
                </div>
                <div className="player right">
                  <Button>
                    Visit Exhibition
                  </Button>
                  <div>Fill this wall with your masterpieces</div>
                </div>
              </div>
            </div>
          );
        }

        return <LobbyContainer>{playersList}</LobbyContainer>;
      };

export default FinalPage;