//lobby page
import {useParams} from "react-router-dom";


const LobbyPage = (props) => {
    const {id} = useParams();

    return <p>lobby, {id}</p>;
};

export default LobbyPage;
