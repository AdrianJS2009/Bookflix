import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: sessionStorage.getItem("token") || null, });
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [rol, setRol] = useState(() => {
    try {
      const payload = JSON.parse(atob(auth?.token?.split(".")[1]));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "usuario";
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return "usuario";
    }
  });

  console.log("rol", rol);

  const iniciarSesion = async (email, password) => {
    try {

      const response = await fetch("https://localhost:7182/api/Auth/login", {
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
        console.log("roleDecoded", roleDecoded);
        setRol(roleDecoded);

        sessionStorage.setItem("token", token);
      } else {
        throw new Error("Token no recibido del servidor");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const cerrarSesion = () => {
    setAuth({token:null});
    sessionStorage.removeItem("token");
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
