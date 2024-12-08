import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_SERVER_API_BASE_URL;
  const [auth, setAuth] = useState({ token: sessionStorage.getItem("token") || localStorage.getItem("token") || null });
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [rol, setRol] = useState(() => {
    try {
      const payload = JSON.parse(atob(auth?.token?.split(".")[1]));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "usuario";
    } catch (error) {
      if(!auth.token) return;
      console.error("Error al decodificar el token:", error);
      return "usuario";
    }
  });


  const iniciarSesion = async (email, password, mantenerSesion) => {
    try {
      const response = await fetch(`${baseURL}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas o error de servidor");
      }

      const { token } = await response.json();

      if (token) {
        setAuth({ token });
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const roleDecoded = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        // console.log("roleDecoded", roleDecoded);
        setRol(roleDecoded);

        if (mantenerSesion){
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        
        try {
          const responseCarrito = await fetch(`${baseURL}/api/Carrito/verificar-o-crear`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!responseCarrito.ok) {
            throw new Error("Error al verificar o crear el carrito.");
          }

          // console.log("Carrito verificado o creado correctamente.");
        } catch (error) {
          console.error("Error al verificar o crear el carrito:", error);
        }
      } else {
        throw new Error("Token no recibido del servidor");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const cerrarSesion = () => {
    setAuth({ token: null });
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, iniciarSesion, cerrarSesion, setAuthenticated, isAuthenticated, rol }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
