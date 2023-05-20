import React from "react";
import "styles/ui/Spinner.scss";

export const Spinner = (props) => {
  return (
    <>
      <div
        className="background"
        style={{ backgroundImage: "url(" + props.backgroundImage + ")" }}
      ></div>
      <div className="spinner">
        <div className="spinner container">
          <h1 className="spinner manifesto">{props.manifesto}</h1>
          <div className="spinner loader">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    </>
  );
};
