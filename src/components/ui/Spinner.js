import React from "react";
import "styles/ui/Spinner.scss";

export const Spinner = (props) => {
  return (
    <div className="spinner">
      <div
        className="spinner background"
        style={{ backgroundImage: "url(" + props.backgroundImage + ")" }}
      ></div>
      <h1 className="spinner manifesto">
        Please wait for your fellow artists to finish the work
      </h1>
      <div className="spinner loader">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
