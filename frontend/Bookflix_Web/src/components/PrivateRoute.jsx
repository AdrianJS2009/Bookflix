import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function PrivateRoute() {
  const { auth, rol } = useAuth();
  const location = useLocation();
  if (rol === "usuario") {
    toast.success("eres usuario")
  }
  console.log("auth ",auth)
  if (!auth.token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  console.log("rol",rol);
  if (rol !== "admin") {
    return <Navigate to="/login" replace />;
  }
  

  return <Outlet />;
}
