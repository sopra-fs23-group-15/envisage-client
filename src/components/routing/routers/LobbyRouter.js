import { Route } from "react-router-dom";
import LobbyPage from "components/views/LobbyPage";
import PropTypes from "prop-types";

const LobbyRouter = (props) => {
  /**
   * "this.props.base" is "/lobby" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Route exact path={`${props.base}/:id`}>
        <LobbyPage />
      </Route>
    </div>
  );
};
/*
 * Don't forget to export your component!
 */

LobbyRouter.propTypes = {
  base: PropTypes.string,
};

export default LobbyRouter;