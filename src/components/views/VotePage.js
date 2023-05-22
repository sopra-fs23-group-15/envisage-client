import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import ImageComponent from "./Image";
import VoteBox from "components/ui/VoteBox";
import { Spinner } from "components/ui/Spinner";
import "styles/views/Vote.scss";
import Lobby from "../../models/Lobby";

const VotePage = () => {
  const [imgs, setImgs] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [renderBox, setRenderBox] = useState(false);
  const navigate = useNavigate();
  const { lobbyId, roundId } = useParams();

  useEffect(() => {
    async function fetch() {
      const response = await api.get(
        `/lobbies/${lobbyId}/games/${roundId}/images`
      );
      setImgs(response.data);
      console.log(response.data);
    }

    let interval;
    interval = setInterval(fetch, 1000);
    return () => clearInterval(interval);
  }, [lobbyId, roundId]);

  const renderTrue = (image, index) => {
    // console.log(image);
    setSelectedImage(image);
    setSelectedIndex(index);
    setRenderBox(true);
  };

  const renderFalse = () => {
    setRenderBox(false);
    setSelectedImage(null);
    setSelectedIndex(null);
  };

  // const handleImageClick = () => {
  //   setSelectedImage(true);//should be false or null NOT true
  // };

  const getNumberRounds = async () => {
    try {
      const responseLobby = await api.get(`/lobbies/${lobbyId}`);
      const lobby = new Lobby(responseLobby.data);
      return lobby.numberOfRounds;
    } catch (error) {
      alert(
        `Something went wrong during fetching the lobby: \n${handleError(
          error
        )}`
      );
    }
  };

  const handleVoteClick = async (playerName, imageId) => {
    if (selectedImage) {
      // Send a request to the server to record the vote
      console.log(`Voted for image: ${selectedImage}`);
      try {
        const player = playerName;
        const score = 1;
        const lobbyId = localStorage.getItem("lobbyId");
        const requestBody = JSON.stringify({ player, score });
        console.log(requestBody);
        const response = await api.put(
          `/lobbies/${lobbyId}/games/votes/${imageId}`,
          requestBody
        );
        console.log(response);
        // Update successfully worked --> navigate to the lobby
        if (roundId < (await getNumberRounds())) {
          navigate(`/lobbies/${lobbyId}/scoreBoard`, {
            state: { currentRound: roundId },
          });
        } else {
          navigate(`/lobbies/${lobbyId}/finalResult`, {
            state: { currentRound: roundId },
          });
        }
      } catch (error) {
        alert(
          `Something went wrong during the update: \n${handleError(error)}`
        );
      }
    }
  };

  let imagesList = (
    <>
      <Spinner
        backgroundImage={localStorage.getItem("challengeImage")}
        manifesto="Please wait for your fellow artists to finish their works"
      />
    </>
  );

  if (imgs) {
    if (imgs.length === parseInt(localStorage.getItem("#players"))) {
      imagesList = (
        <div className="vote">
          <div
            className="vote container"
            style={{
              backgroundImage:
                "url(" + localStorage.getItem("challengeImage") + ")",
            }}
          ></div>
          <h1 className="vote manifesto">Vote for your favorite image!</h1>
          <div className="vote image-container">
            {imgs.map((image) => (
              <div>
                <ImageComponent
                  url={true}
                  image={image.image}
                  onClick={() => {
                    renderTrue(image.image, image.id);
                    console.log("clicked on image " + image.id);
                    console.log(image.player);
                  }}
                  selected={selectedIndex === image.id}
                />
                {renderBox && selectedIndex === image.id && (
                  <VoteBox
                    renderFalse={renderFalse}
                    handleVoteClick={handleVoteClick}
                    // handleImageClick={handleImageClick}//remove selection around image
                    selectedImage={selectedImage}
                    playerName={image.player}
                    imageId={image.id}
                    keywords={image.keywords}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  return <>{imagesList}</>;
};

export default VotePage;
