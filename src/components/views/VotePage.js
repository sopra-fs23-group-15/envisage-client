import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import ImageComponent from "./Image";
import VoteBox from "components/ui/VoteBox";
import { Spinner } from "components/ui/Spinner";
import "styles/views/Vote.scss";

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
      console.log("fetched");
    }

    let interval;
    interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [lobbyId, roundId]);

  const renderTrue = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setRenderBox(true);
  };

  const renderFalse = () => {
    setRenderBox(false);
  };

  const handleImageClick = () => {
    setSelectedImage(null);
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
        if (roundId < 2) {
          navigate(`/lobbies/${lobbyId}/scoreBoard`);
        } else {
          navigate(`lobbies/${lobbyId}/finalResult`);
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
      <Spinner backgroundImage={localStorage.getItem("challengeImage")} />
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
                  selected={selectedImage === image.image}
                />
                {renderBox && selectedIndex === image.id && (
                  <VoteBox
                    renderFalse={renderFalse}
                    handleVoteClick={handleVoteClick}
                    handleImageClick={handleImageClick}
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
