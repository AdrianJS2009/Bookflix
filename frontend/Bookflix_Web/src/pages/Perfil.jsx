import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Perfil = () => {
  const { auth, cerrarSesion } = useAuth();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Si no hay token, redirigir al login
  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Si el token está presente, obtenemos los datos del usuario y el historial de pedidos
  useEffect(() => {
    if (auth.token) {
      // Obtener datos del usuario
      fetch("https://localhost:7182/api/User/perfil", {
        headers: {
          "Authorization": `Bearer ${auth.token}`, // Enviamos el token en los headers
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });

      // Obtener el historial de compras
      fetch("https://localhost:7182/api/User/historial", {
        headers: {
          "Authorization": `Bearer ${auth.token}`, // Enviamos el token en los headers
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setOrders(data);
        })
        .catch((error) => {
          console.error("Error al obtener el historial de compras:", error);
        });
    }
  }, [auth.token]);

  if (!auth.token) {
    return <p>Cargando...</p>; // O redirige a login si no hay token
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      {userData ? (
        <div>
          <h2>Datos del Usuario</h2>
          <p><strong>Nombre:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>

        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}

      <h2>Historial de Compras</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p><strong>Pedido ID:</strong> {order.id}</p>
              <p><strong>Fecha:</strong> {order.fecha}</p>
              <p><strong>Total:</strong> {order.total}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes pedidos realizados.</p>
      )}
    </div>
  );
};

export default Perfil;
