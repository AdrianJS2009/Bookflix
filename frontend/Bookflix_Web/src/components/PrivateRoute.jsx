import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute() {
  const { auth, rol } = useAuth();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log("rol",rol);
  if (rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
