import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("legalAI_token");
  const isLoggedIn = localStorage.getItem("legalAI_loggedIn") === "true" && Boolean(token);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;