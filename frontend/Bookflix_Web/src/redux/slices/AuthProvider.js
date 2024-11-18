import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cerrarSesion, iniciarSesion } from "../redux/slices/authSlice";
import {
  cargarCarrito,
  cargarCarritoDesdeLocalStorage,
  limpiarCarrito,
} from "../redux/slices/carritoSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.auth.usuario);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const usuario = JSON.parse(atob(token.split(".")[1]));
        dispatch(iniciarSesion({ usuario, token }));
        dispatch(cargarCarrito(usuario.id));
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
      }
    }
  }, [dispatch]);

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("https://localhost:7182/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.token) {
        dispatch(iniciarSesion({ usuario: data.usuario, token: data.token }));
        dispatch(cargarCarrito(data.usuario.id));
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    dispatch(cerrarSesion());
    dispatch(limpiarCarrito());
    dispatch(cargarCarritoDesdeLocalStorage());
  };

  return (
    <AuthContext.Provider value={{ usuario, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
