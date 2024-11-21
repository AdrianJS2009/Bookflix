import React, { useState } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/default.css";
import "../styles/form.css";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7182/api/User/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          direccion,
          rol: "usuario",
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el usuario.");
      }

      alert("Usuario registrado correctamente.");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="form-container texto-mediano">
        <h1 className="texto-grande">Registro</h1>
        <form onSubmit={handleRegister} className="form">
          {error && <p className="error">{error}</p>}
          <div className="campo-formulario">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button label="Registrarse" type="submit" styleType="btnDefault" />
        </form>
        <p className="texto-pequeño">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="link">
            Inicia sesión aquí.
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Registro;
