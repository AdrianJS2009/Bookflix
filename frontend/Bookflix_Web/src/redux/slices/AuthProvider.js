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
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));

        const ahora = Math.floor(Date.now() / 1000);
        if (payload.exp < ahora) {
          console.warn("El token ha expirado.");
          localStorage.removeItem("token");
          dispatch(cerrarSesion());
          return;
        }

        const usuario = {
          id: payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          nombre:
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ],
          rol: payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
        };

        if (!usuario.id) {
          console.warn("El token no contiene un usuario válido.");
          return;
        }

        dispatch(iniciarSesion({ usuario, token }));
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem("token");
        dispatch(cerrarSesion());
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
