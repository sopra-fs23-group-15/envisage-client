import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "components/views/LandingPage";
import LobbyCreation from "components/views/LobbyCreation";
import Lobbies from "components/views/Lobbies";
import Games from "components/views/Games";
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

      <Routes>
        <Route path="/" element={<Navigate replace to="/landingPage" />} />
        <Route path="landingPage" element={<LandingPage />} />
        <Route path="lobbyCreation" element={<LobbyCreation />} />
        <Route path="lobbies/:lobbyId" element={<Lobbies />} />
        <Route path="lobbies/:lobbyId/games/:roundId" element={<Games />} />
        <Route path="image" element={<ImageComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
