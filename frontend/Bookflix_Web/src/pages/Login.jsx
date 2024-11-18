import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { iniciarSesion } from "../redux/slices/authSlice";

import "../styles/default.css";
import "../styles/form.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7182/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      // Analizar la respuesta JSON
      const data = await response.json();
      console.log("Respuesta completa del backend:", data);

      if (data.token) {
        const token = data.token;

        console.log("Token recibido del backend:", token);

        // Decodificar el token para extraer información del usuario
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

        // Guardar el token en localStorage y actualizar Redux
        localStorage.setItem("token", JSON.stringify({ token }));
        dispatch(iniciarSesion({ usuario, token }));

        navigate("/");
      } else {
        throw new Error("Token no recibido del backend");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <>
      <Header />
      <div className="form-container">
        <h1 className="texto-grande">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="form texto-mediano">
          <div className="campo-formulario">
            <label className="text-form" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              placeholder="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label className="text-form" htmlFor="password">
              Contraseña
            </label>
            <input
              placeholder="Contraseña"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button label="Entrar" type="submit" styleType="btnDefault" />
        </form>
        <NavLink to="/registro" className="texto-pequeño">
          ¿Aún no tienes cuenta? Regístrate
        </NavLink>
      </div>
      <Footer />
    </>
  );
}
