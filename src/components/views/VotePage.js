import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import ImageComponent from "./Image";
import VoteBox from "components/ui/VoteBox";
import "styles/views/Vote.scss";

const VotePage = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [renderBox, setRenderBox] = useState(false);
  const navigate = useNavigate();

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

  const handleVoteClick = async () => {
    if (selectedImage) {
      // Send a request to the server to record the vote
      console.log(`Voted for image: ${selectedImage}`);
      try {
        const userName = localStorage.getItem("player");
        const lobbyId = localStorage.getItem("lobbyId");
        const requestBody = JSON.stringify({ player: userName, score: 1 });
        console.log(requestBody);
        const response = await api.put(
          `/lobbies/${lobbyId}/games/votes`,
          requestBody
        );
        console.log(response);
        // Update successfully worked --> navigate to the lobby
        navigate(`/lobbies`);
      } catch (error) {
        alert(
          `Something went wrong during the update: \n${handleError(error)}`
        );
      }
    }
  };

  return (
    <div className="vote">
      <div
        className="vote container"
        style={{
          backgroundImage: "url(" + localStorage.getItem("image") + ")",
        }}
      ></div>
      <h1 className="vote manifesto">Vote for your favorite image!</h1>
      <div className="vote image-container">
        {images.map((image, index) => (
          <div>
            <ImageComponent
              key={index}
              url={image.url}
              image={image.image}
              onClick={() => {
                renderTrue(image, index);
                console.log("clicked on image " + index);
              }}
              selected={selectedImage === image}
            />
            {renderBox && selectedIndex === index && (
              <VoteBox
                renderFalse={renderFalse}
                handleVoteClick={handleVoteClick}
                handleImageClick={handleImageClick}
                selectedImage={selectedImage}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotePage;