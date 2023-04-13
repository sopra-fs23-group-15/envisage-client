import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import {useHistory} from 'react-router-dom';
import { Button } from "components/ui/Button";
import {useParams} from "react-router-dom";


const LobbyPage = (props) => {
    const history = useHistory();
    const [players, setPlayers] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        async function fetchData(){
            const response = await api.get("/lobbies/" + id);
            console.log(response)
            setPlayers(response.data.players);
        }
        const timer = setInterval(() => {
            fetchData();
        }, 2000);
        return () => clearInterval(timer);
    }, [id]);

    const startGame = async () => {
        await api.post("/lobbies/" + id + "/games");
        history.push("/gamePage")
    }

    let playerList = <div>no users</div>
    let startButton = <div></div>

    if (players) {
        playerList = (<ul className="game user-list">
                    {players.map(user => (
                        <div className="player container">
                            <div className="player username">{user.userName}</div>
                        </div>
                    ))}
                    </ul>)
    }

    if (localStorage.getItem('creator') && players){
        startButton = (
            <Button disabled={players.length < 3} onClick={() => startGame()}>
                Start the game
            </Button>
        )
    }

    return (<p>{playerList}{startButton}</p>);
};

export default LobbyPage;
