import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LandingPage from "components/views/LandingPage";
import LobbyRouter from "components/routing/routers/LobbyRouter";
import LobbyCreation from "components/views/LobbyCreation";
import GamePage from "components/views/GamePage";
import ImageComponent from "components/views/Image";
/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/landingPage" />
        </Route>
        <Route path="/landingPage">
          <LandingPage />
        </Route>
        <Route path="/lobbyCreation">
          <LobbyCreation />
        </Route>
        <Route path="/lobbies">
          <LobbyRouter base="/lobbies" />
        </Route>
        <Route path="/gamePage">
          <GamePage />
        </Route>
        <Route path="/image">
          <ImageComponent />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
