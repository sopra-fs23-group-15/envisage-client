import React, { useState } from "react";

export const ManifestoBanner = () => {
    const [tutorial, setTutorial] = useState(0);
  
    const switchTutorial = () => {
      if (tutorial < 3) {
        setTutorial((prev) => prev + 1);
      } else {
        setTutorial(0);
      }
    };
    return (
        <p className="login manifesto" onClick={() => switchTutorial()}>
        {!tutorial
          ? `How to draw/describe in the game ⇨
`
          : tutorial === 1
          ? `Come up with key words for a given image and form phrases ⇨`
          : tutorial === 2
          ? `Have a look at the drawing style we provided, could be an artist's name ⇨`
          : `Twist your descriptions with creative flavors! ⓧ`}
      </p>
    );
  };