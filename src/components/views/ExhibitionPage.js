import { useNavigate } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import { Button } from "components/ui/Button";
import React, { useEffect, useState } from "react";
import { Spinner } from "components/ui/Spinner";
import ImageComponent from "./Image";

import "styles/views/Exhibition.scss";
import { api } from "helpers/api";

const ExhibitionPage = () => {
  const [imgs, setImgs] = useState([]);

  const navigate = useNavigate();
  const goMain = async () => {
    localStorage.removeItem("lobbyId");
    navigate("landingPage");
  };
  const lobbyId = localStorage.getItem("lobbyId");
  const username = localStorage.getItem("userName");
  console.log(username);
  useEffect(()=>{
    try{
    async function fetch() {
      const response = await api.get(`/lobbies/${lobbyId}/games/images/${username}`);
      console.log(response.data);
    setImgs(response.data);
  };
    fetch();
    
  } catch (error){
    return(
      <>
      Not implemented yet in the backend.\n
      {error}
      </>
    )
  }
  },[]);

  let imageList = (
    <>
      <Spinner backgroundImage={localStorage.getItem("challengeImage")} />
    </>
  );
  if (imgs) {
    imageList =   
    <div>
    {imgs.map((image) => (
           <ImageComponent
             url={true}
             image={image.image}
           />
      ))}
    </div>
    }


  return (
    <LobbyContainer>
      <h1>Welcome to the exhibition</h1>
      <div className="image-container">
      {imageList}
      </div>
      <div className="buttons">
        <Button onClick={() => goMain()}>Logout</Button>
        <Button className="button2">Restart</Button>
      </div>
    </LobbyContainer>
  );
};

export default ExhibitionPage;
