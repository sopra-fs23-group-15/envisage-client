import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import {useHistory} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Button } from "components/ui/Button";


const Lobby = (props) => {
    const history = useHistory();
    const location = useLocation();
    const [lobby, setLobby] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const response = api.get("/lobbies/" + location.state.lobby);
        setLobby(response.data);
        setUsers(lobby.players);

        const timer = setInterval(() => {
            const response = api.get("/lobbies/" + location.state.lobby);
            setLobby(response.data);
            setUsers(lobby.players);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

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

    if (localStorage.getItem('creator') == 'true'){
        content2 = (
            <Button disabled={users.length < 3}>
                Start the game
            </Button>
        )
    }

    return <p>{content}{content2}</p>;
};

export default Lobby;
