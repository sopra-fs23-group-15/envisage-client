import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


export const LobbyGuard = () => {
  if (localStorage.getItem("lobbyId")) {
    return <Outlet />;
  }
  return <Navigate to="/landingPage" />;
};