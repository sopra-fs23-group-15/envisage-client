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
        Said by <span>{props.userName ? props.userName : "player:"}</span>
      </h3>
      <h5 className="vote box-keywords">
        {props.keyWord ? props.keyWord : '"description of the image"'}
      </h5>
      <Button
        className="V"
        onClick={props.handleVoteClick}
        disabled={!props.selectedImage}
      >
        Vote
      </Button>
    </div>
  );
};

export default VoteBox;
