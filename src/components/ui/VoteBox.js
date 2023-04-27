import React from "react";
import { Button } from "./Button";

const VoteBox = (props) => {
  return (
    <div className="vote box">
      <div
        className="vote box-click"
        onClick={() => {
          props.renderFalse();
          props.handleImageClick();
        }}
      >
        ⓧ
      </div>
      <h3 className="vote box-title">
        Said by <span>{props.playerName}:</span>
      </h3>
      <h5 className="vote box-keywords">
        {props.keyWords ? props.keyWords : '"description of the image"'}
      </h5>
      <Button
        className="V"
        onClick={() => props.handleVoteClick(props.playerName)}
        disabled={!props.selectedImage}
      >
        Vote
      </Button>
    </div>
  );
};

export default VoteBox;
