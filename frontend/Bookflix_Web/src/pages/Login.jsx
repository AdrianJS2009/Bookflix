import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/default.css";
import "../styles/form.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    });

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      alert("Credenciales incorrectas");
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
