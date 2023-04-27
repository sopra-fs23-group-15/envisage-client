import { useNavigate } from "react-router-dom";
import LobbyContainer from "components/ui/LobbyContainer";
import { Button } from "components/ui/Button";
import React from "react";
import "styles/views/Exhibition.scss";

const ExhibitionPage = () => {
  const navigate = useNavigate();

  const goMain = async () => {
    localStorage.removeItem("lobbyId");
    navigate("landingPage");
  };

  return (
    <LobbyContainer>
      <h1>Welcome to the exhibition</h1>
      <div className="buttons">
        <Button onClick={() => goMain()}>Logout</Button>
        <Button className="button2">Restart</Button>
      </div>
    </LobbyContainer>
  );
};

export default ExhibitionPage;
