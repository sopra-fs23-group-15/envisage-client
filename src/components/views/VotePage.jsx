import React, { useState } from "react";
import ImageComponent from "./Image";
import "styles/views/Vote.scss";

function Voting({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    setSelectedImage(null);
  };

  const handleVoteClick = () => {
    if (selectedImage) {
      // Send a request to the server to record the vote
      console.log(`Voted for image: ${selectedImage}`);
    }
  };

  return (
    <div>
      <h1>Vote for your favorite image!</h1>
      <div className="image-container">
        {images.map((image, index) => (
          <ImageComponent
            key={index}
            url={image.url}
            image={image.image}
            onClick={() => setSelectedImage(image)}
            selected={selectedImage === image}
          />
        ))}
      </div>
      <button disabled={!selectedImage} onClick={handleVoteClick}>
        Vote
      </button>
      <button onClick={handleImageClick}>Clear Selection</button>
    </div>
  );
}

export default Voting;
