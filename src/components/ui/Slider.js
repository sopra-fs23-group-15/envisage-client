import React, { useState } from "react";
import slider1 from "img/slider1.png";
import slider2 from "img/slider2.png";
import slider3 from "img/slider3.png";
import slider4 from "img/slider4.png";
import slider5 from "img/slider5.png";
import "styles/ui/Slider.scss";

const images = [
  { img: slider1 },
  { img: slider2 },
  { img: slider3 },
  { img: slider4 },
  { img: slider5 },
];

const Slider = () => {
  const [currentImg, setCurrentImg] = useState(2);

  const goToLeft = () => {
    const newIndex = currentImg === 0 ? images.length - 1 : currentImg - 1;
    setCurrentImg(newIndex);
  };

  const goToRight = () => {
    const newIndex = currentImg === images.length - 1 ? 0 : currentImg + 1;
    setCurrentImg(newIndex);
  };

  return (
    <div className="slider">
      <div className="slider label">
        "Captain America jumps into a big splash of water, David Hockney style"
      </div>
      <div className="slider left-arrow" onClick={goToLeft}>
        ❮
      </div>
      <div className="slider right-arrow" onClick={goToRight}>
        ❯
      </div>
      <div
        className="slider inner"
        style={{ backgroundImage: `url(${images[currentImg].img})` }}
      ></div>
    </div>
  );
};

export default Slider;
