import "styles/ui/LobbyContainer.scss";
import PropTypes from "prop-types";

const LobbyContainer = (props) => (
  <div {...props} className={`lobby-container ${props.className ?? ""}`}>
    {props.children}
  </div>
);

LobbyContainer.propTypes = {
  children: PropTypes.node,
};

export default LobbyContainer;
