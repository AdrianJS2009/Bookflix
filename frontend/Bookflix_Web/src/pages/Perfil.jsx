import React, { useEffect, useState } from "react";
import "../styles/perfilPedidos.css";

export default function PerfilPedidos() {
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    direccion: "",
  });
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7182/api/User/perfil")
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) =>
        console.error("Error al obtener datos del usuario:", error)
      );

    fetch("https://localhost:7182/api/User/historial")
      .then((response) => response.json())
      .then((data) => setPedidos(data))
      .catch((error) =>
        console.error("Error al obtener historial de pedidos:", error)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://localhost:7182/api/User/actualizar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos actualizados:", data);
      })
      .catch((error) =>
        console.error("Error al actualizar datos del usuario:", error)
      );
  };

  return (
    <div className="perfil-pedidos-container">
      <div className="perfil-container">
        <h1>Perfil</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={userData.nombre}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="direccion"
              value={userData.direccion}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Guardar cambios</button>
        </form>
      </div>
      <div className="pedidos-container">
        <h1>Mis Pedidos</h1>
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <p>Producto: {pedido.producto}</p>
              <p>Fecha: {pedido.fecha}</p>
              <p>Estado: {pedido.estado}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
