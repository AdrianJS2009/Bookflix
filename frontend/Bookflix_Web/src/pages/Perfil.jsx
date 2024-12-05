import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/PerfilPedidos.css";
import "../styles/default.css";

const Perfil = () => {
  const { auth} = useAuth();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (auth.token) {
      fetch("https://localhost:7182/api/User/perfil", {
        headers: {
          "Authorization": `Bearer ${auth.token}`, 
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });

      fetch("https://localhost:7182/api/User/historial", {
        headers: {
          "Authorization": `Bearer ${auth.token}`, 
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
    return <p>Cargando...</p>; 
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
