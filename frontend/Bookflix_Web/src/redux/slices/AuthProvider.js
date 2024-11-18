
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { iniciarSesion, cerrarSesion } from "../redux/slices/authSlice";
import { cargarCarrito, limpiarCarrito, cargarCarritoDesdeLocalStorage } from "../redux/slices/carritoSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.auth.usuario);

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
        dispatch(cargarCarrito(data.usuario.id));  // Load cart from backend
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    dispatch(cerrarSesion());
    dispatch(limpiarCarrito());  // Clear Redux cart
    dispatch(cargarCarritoDesdeLocalStorage());  // Reset to localStorage cart
  };

  return (
    <AuthContext.Provider value={{ usuario, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
