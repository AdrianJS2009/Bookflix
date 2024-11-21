import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    usuario: null,
    token: sessionStorage.getItem("token") || null,
  });

  const iniciarSesion = (usuario, token) => {
    if (usuario && usuario.id) {
      setAuth({ usuario, token });
      sessionStorage.setItem("token", token);
    } else {
      console.error("Usuario o token inválidos");
    }
  };

  const cerrarSesion = () => {
    setAuth({ usuario: null, token: null });
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
