import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import {useHistory} from 'react-router-dom';
import { Button } from "components/ui/Button";
import {useParams} from "react-router-dom";


const LobbyPage = (props) => {
    const history = useHistory();
    const [lobby, setLobby] = useState(null);
    const [users, setUsers] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        const response = api.get("/lobbies/" + id);
        setLobby(response.data);
        setUsers(lobby.players);

        const timer = setInterval(() => {
            const response = api.get("/lobbies/" + id);
            setLobby(response.data);
            setUsers(lobby.players);
        }, 8000);
        return () => clearInterval(timer);
    }, [id, lobby.players]);

    const startGame = async () => {
        await api.post("/lobbies/" + id + "/games");
        history.push("/gamePage")
    }

    let content = <div>no users</div>
    let content2 = <div></div>

    if (users) {
        content = (<ul className="game user-list">
                    {users.map(user => (
                        <div className="player container">
                            <div className="player username">{user.userName}</div>
                        </div>
                    ))}
                    </ul>)
    }

    if (localStorage.getItem('creator')){
        content2 = (
            <Button disabled={users.length < 3} onClick={() => startGame()}>
                Start the game
            </Button>
        )
    }

    return (<p>{content}{content2}</p>);
};

export default LobbyPage;
