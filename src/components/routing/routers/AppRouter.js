import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "components/views/LandingPage";
import LobbyCreation from "components/views/LobbyCreation";
import Lobbies from "components/views/Lobbies";
import Games from "components/views/Games";
import VotePage from "components/views/VotePage";
import FinalPage from "components/views/FinalPage";
import ExhibitionPage from "components/views/ExhibitionPage";
import LobbiesAfter from "components/views/LobbiesAfter";
import LobbyConfiguration from "components/views/LobbyConfiguration";
import { LobbyGuard } from "components/routing/routeProtectors/LobbyGuard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/landingPage" />} />
        <Route path="landingPage" element={<LandingPage />} />
        <Route path="lobbyCreation" element={<LobbyCreation />} />
        <Route path="lobbyConfiguration" element={<LobbyConfiguration />} />
        <Route element={<LobbyGuard />}>
          <Route path="lobbies/:lobbyId" element={<Lobbies />} />
          <Route path="lobbies/:lobbyId/games/:roundId" element={<Games />} />
          <Route
            path="lobbies/:lobbyId/scoreBoard"
            element={<LobbiesAfter />}
          />
          <Route
            path="lobbies/:lobbyId/games/:roundId/votePage"
            element={<VotePage />}
          />
          <Route path="lobbies/:lobbyId/finalResult" element={<FinalPage />} />
          <Route
            path="lobbies/:lobbyId/exhibitionPage"
            element={<ExhibitionPage />}
          />
        </Route>
        <Route path="*" element={<Navigate replace to="/landingPage" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
