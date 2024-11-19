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
    const tokenObj = JSON.parse(localStorage.getItem("token"));
    const token = tokenObj?.token || null;

    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));

        const ahora = Math.floor(Date.now() / 1000);
        if (payload.exp < ahora) {
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

        dispatch(iniciarSesion({ usuario, token }));
        dispatch(cargarCarrito(usuario.id));
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

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      if (data.Token) {
        const token = data.Token;

        // Decodificar el token
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
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

        localStorage.setItem("token", JSON.stringify({ token }));
        dispatch(iniciarSesion({ usuario, token }));
        dispatch(cargarCarrito(usuario.id));
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
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
