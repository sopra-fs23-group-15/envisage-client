import React, { useState } from "react";
import slider1 from "img/slider1.png";
import slider2 from "img/slider2.png";
import slider3 from "img/slider3.png";
import slider4 from "img/slider4.png";
import slider5 from "img/slider5.png";
import slider6 from "img/slider6.png";
import "styles/ui/Slider.scss";

const images = [
  { img: slider1 },
  { img: slider2 },
  { img: slider3 },
  { img: slider4 },
  { img: slider5 },
  { img: slider6 },
];

const Slider = () => {
  const [currentImg, setCurrentImg] = useState(4);
  const [tutorial, setTutorial] = useState(false);

  const goToLeft = () => {
    const newIndex = currentImg === 0 ? images.length - 1 : currentImg - 1;
    setCurrentImg(newIndex);
  };

  const goToRight = () => {
    const newIndex = currentImg === images.length - 1 ? 0 : currentImg + 1;
    setCurrentImg(newIndex);
  };

  const onTutorial = () => {
    setTutorial((prev) => !prev);
  };

  return (
    <div className="slider">
      <div
        className="slider inner"
        style={{ backgroundImage: `url(${images[currentImg].img})` }}
      ></div>
      <p className="slider label-before" style={tutorial? {visibility: "hidden"} : {visibility: "visible"}}>How would you draw it in the game?</p>
      <p className="slider label-after" style={tutorial? {visibility: "visible"} : {visibility: "hidden"}}>
        Step 1: <span>Describe the image</span> about Captain America in a short phrase such as <span>"Captain America jumps in water"</span>
        <br />
        Step 2: Have a look at the <span>drawing style</span> we provided{` (could be an artist's name such as)`} <span>David Hockney</span>
        <br />
        Add flavors and voilà: <span>"Captain America doing a big splash in the river of stars, David Hockney style"</span>
      </p>
      <p className="slider switch" onClick={() => onTutorial()}>
        {tutorial ? "ⓧ" : "⇨"}
      </p>
      <div className="slider left-arrow" onClick={() => goToLeft()}>
        ❮
      </div>
      <div className="slider right-arrow" onClick={() => goToRight()}>
        ❯
      </div>
    </div>
  );
};

export default Slider;
