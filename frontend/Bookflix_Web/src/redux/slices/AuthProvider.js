import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cerrarSesion, iniciarSesion } from "../redux/slices/authSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (!storedToken) {
      console.warn("No se encontró un token en sessionStorage.");
      dispatch(cerrarSesion());
      return;
    }

    try {
      // Decodificar el token
      const payloadBase64 = storedToken.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      console.log("Contenido del token decodificado:", payload);

      const ahora = Math.floor(Date.now() / 1000);
      if (payload.exp < ahora) {
        console.warn("El token ha expirado.");
        sessionStorage.removeItem("token");
        dispatch(cerrarSesion());
        return;
      }

      // Extraer datos del usuario desde el token
      const usuario = {
        id:
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || null,
        nombre:
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || "Usuario",
        rol:
          payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || "usuario",
      };

      if (!usuario.id) {
        console.error("El token no contiene un ID de usuario válido.");
        sessionStorage.removeItem("token");
        dispatch(cerrarSesion());
        return;
      }

      console.log("Usuario inicializado correctamente:", usuario);
      dispatch(iniciarSesion({ usuario, token: storedToken }));
    } catch (error) {
      console.error(
        "Error al procesar el token en AuthProvider:",
        error.message
      );
      sessionStorage.removeItem("token");
      dispatch(cerrarSesion());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
