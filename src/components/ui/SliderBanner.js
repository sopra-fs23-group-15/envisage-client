import React, { useState } from "react";

export const SliderBanner = () => {
  const [tutorial, setTutorial] = useState(0);

  const switchTutorial = () => {
    if (tutorial < 3) {
      setTutorial((prev) => prev + 1);
    } else {
      setTutorial(0);
    }
  };
  return (
    <div>
      <p
        className="slider label-before"
        style={tutorial ? { visibility: "hidden" } : { visibility: "visible" }}
      >
        How would you draw it in the game?
      </p>
      <p
        className="slider label-after"
        style={
          tutorial === 1 ? { visibility: "visible" } : { visibility: "hidden" }
        }
      >
        Step 1: <span>Describe the image</span> about Captain America in a short
        phrase such as <span>"Captain America jumps in water"</span>
      </p>
      <p
        className="slider label-after"
        style={
          tutorial === 2 ? { visibility: "visible" } : { visibility: "hidden" }
        }
      >
        Step 2: Have a look at the <span>drawing style</span> we provided
        {` (could be an artist's name such as)`} <span>David Hockney</span>
      </p>
      <p
        className="slider label-after"
        style={
          tutorial === 3 ? { visibility: "visible" } : { visibility: "hidden" }
        }
      >
        Add flavors and voilà:{" "}
        <span>
          "Captain America doing a big splash in the river of stars, David
          Hockney style"
        </span>
      </p>
      <p className="slider switch" onClick={() => switchTutorial()}>
        {tutorial === 3 ? "ⓧ" : "⇨"}
      </p>
    </div>
  );
};
