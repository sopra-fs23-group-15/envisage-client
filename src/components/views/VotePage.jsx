import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import ImageComponent from "./Image";
import "styles/views/Vote.scss";
import "styles/ui/BaseContainer.scss";

const  Voting = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const history = useHistory();

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
      const requestBody = JSON.stringify({player: userName, score: 1});
      console.log(requestBody);
      const response = await api.put(`/lobbies/${lobbyId}/games/votes`, requestBody
      );
        console.log(response);
      // Update successfully worked --> navigate to the route /users/${id} in the GameRouter
      history.push(`/gamePage`);
    } catch (error) {
      alert(`Something went wrong during the update: \n${handleError(error)}`);
    }
    }
  };

  return (
    <div className="base-container">
      <h1>Vote for your favorite image!</h1>
      <div className="image-container">
        {images.map((image, index) => (
          <ImageComponent
            key={index}
            url={image.url}
            image={image.image}
            onClick={() => {setSelectedImage(image);console.log("clicked on image " + index);}}
            selected={selectedImage === image}
          />
        ))}
      </div>
      <div className="center">
      <button disabled={!selectedImage} onClick={handleVoteClick}>
        Vote
      </button>
      <button onClick={handleImageClick}>Clear Selection</button>
      </div>
    </div>
  );
}

export default Voting;
