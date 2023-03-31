import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import PropTypes from "prop-types";

const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const LandingPage = props => {

    const [username, setUsername] = useState(null);
    const [lobbyID, setLobbyID] = useState(null);
    const history = useHistory();

    const joinLobby = async () => {
        try{
            const response = api.get('/lobbies/' + lobbyID);
            addUser();
        }
        catch(error){
            alert(`Something went wrong when joining the lobby: \n${handleError(error)}`);
        }
    }

    const addUser = async() => {
        try{
            const requestBody = JSON.stringify({username});
            const response = api.post('/users', requestBody);
            const response2 = api.post('/lobbies/' + lobbyID, requestBody);

            history.push('/lobby/' + lobbyID);
        }
        catch(error){
            alert(`Something went wrong when joining the lobby: \n${handleError(error)}`);
        }
    }

    return(
        <div className='login container'>
            <FormField
                label="LobbyID"
                value={lobbyID}
                onChange={id => setLobbyID(id)}
            />
            <FormField
                label="Username"
                value={username}
                onChange={un => setUsername(un)}
            />
            <button
              disabled={!username || !lobbyID}
              onClick={() => joinLobby()}
            >
                Continue
            </button>
            <button>
                Create a lobby and invite friends
            </button>
        </div>
    )
}

export default LandingPage;