import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/default.css";
import "../styles/form.css";

export default function Registro() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState(""); // Asegúrate de que el estado esté definido
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7182/api/user/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          apellidos: lastName, // Usar el estado `lastName`
          email,
          direccion: address,
          rol: "usuario",
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        alert("Error al registrar el usuario.");
        return;
      }

      alert("Usuario registrado correctamente.");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
      alert("No se pudo registrar el usuario. Intenta de nuevo.");
    }
  };

  return (
    <>
      <Header />
      <div className="form-container">
        <h1 className="texto-grande">REGISTRO</h1>
        <form onSubmit={handleRegister} className="form texto-mediano">
          <div className="campo-formulario">
            <label className="text-form" htmlFor="name">
              Nombre
            </label>
            <input
              placeholder="Nombre"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label className="text-form" htmlFor="lastName">
              Apellidos
            </label>
            <input
              placeholder="Apellidos"
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label className="text-form" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              placeholder="Correo Electrónico"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label className="text-form" htmlFor="address">
              Dirección
            </label>
            <input
              placeholder="Dirección"
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
          <div className="campo-formulario">
            <label className="text-form" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              placeholder="Confirmar Contraseña"
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
          ¿Tienes cuenta?{" "}
          <a href="/login" className="link">
            Inicia sesión
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
}
