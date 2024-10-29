import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/default.css";
import "../styles/form.css";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apellidos, setApellidos] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const response = await fetch("http://localhost:5000/api/user/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre: nombre,
        Apellidos: apellidos,
        Email: email,
        Password: password,
        Direccion: direccion,
      }),
    });

    if (response.ok) {
      alert("Registro exitoso");
      navigate("/login");
    } else {
      const errorData = await response.json();
      console.log("Error:", errorData);
      alert("Error al registrarse");
    }
  };

  return (
    <>
      <Header />
      <div className="form-container">
        <h1 className="texto-grande">Registro</h1>
        <form onSubmit={handleRegister} className="form texto-mediano">
          <div className="campo-formulario">
            <label className="text-form" htmlFor="nombre">
              Nombre
            </label>
            <input
              placeholder="Nombre"
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label className="text-form" htmlFor="apellidos">
              Apellidos
            </label>
            <input
              placeholder="Apellidos"
              type="text"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
          </div>
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
            <label className="text-form" htmlFor="direccion">
              Dirección
            </label>
            <input
              placeholder="Dirección"
              type="text"
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
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
          <div className="campo-formulario">
            <label className="text-form" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              placeholder="Confirmar contraseña"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Registrarse</button>
        </form>
        <Link to="/login" className="texto-pequeño">
          ¿Tienes cuenta? Inicia sesión
        </Link>
      </div>
      <Footer />
    </>
  );
}
