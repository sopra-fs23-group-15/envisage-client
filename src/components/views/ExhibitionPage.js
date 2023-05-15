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
  const visitWinningImages = async () => {
    navigate(`/lobbies/${lobbyId}/winningimages`);
  };

  const lobbyId = localStorage.getItem("lobbyId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    try {
      async function fetch() {
        const response = await api.get(
          `/lobbies/${lobbyId}/games/images/${userName}`
        );
        console.log(response.data);
        setImgs(response.data);
      }
      fetch();
    } catch (error) {
      return { error };
    }
  }, [lobbyId, userName]);

  let imageList = (
    <>
      <Spinner backgroundImage={localStorage.getItem("challengeImage")} />
    </>
  );

  if (imgs) {
    imageList = (
      <div className="image-container">
        {imgs.map((image) => (
          <ImageComponent url={true} image={image.image} />
        ))}
      </div>
    );
  }

  return (
    <LobbyContainer>
      {imageList}
      <div className="button-container">
        <>
          <h3>
            Hello <span>{userName}</span>! Welcome to your solo exhibition
          </h3>
        </>
        <Button className="E" onClick={() => visitWinningImages()}>
          See Winning Images
        </Button>
        <Button className="E">Restart a game</Button>
        <Button className="E" onClick={() => goMain()}>
          Logout
        </Button>
      </div>
    </LobbyContainer>
  );
};

export default ExhibitionPage;
