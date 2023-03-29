import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import LandingPage from "components/views/LandingPage";
import LobbyRouter from "components/routing/routers/LobbyRouter"

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
        <Route path="/lobby">
            <LobbyRouter base="/lobby"/>
        </Route>
        <Route exact path="/landingPage">
            <LandingPage/>
        </Route>
        <Route exact path="/">
          <Redirect to="/landingPage"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
