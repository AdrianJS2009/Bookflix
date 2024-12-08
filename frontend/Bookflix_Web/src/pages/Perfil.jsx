import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button.jsx';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import '../styles/default.css';
import '../styles/Perfil.css';

const ModalEditarPerfil = ({ isOpen, onClose, userData, onUpdate }) => {
  const baseURL = import.meta.env.VITE_SERVER_API_BASE_URL;
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    nombre: userData.nombre || '',
    apellidos: userData.apellidos || '',
    email: userData.email || '',
    direccion: userData.direccion || '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, apellidos, email, direccion, password } = formData;
    try {
      const response = await fetch(`${baseURL}/api/User/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          direccion,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar los datos.");
      }

      onUpdate(formData);
      onClose();
      toast.success("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Apellidos:</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-buttons">
            <Button type="submit" label="Actualizar" className="btnComprar" />
            <Button
              type="button"
              label="Cerrar"
              className="btnComprar"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const Perfil = () => {
  const baseURL = import.meta.env.VITE_SERVER_API_BASE_URL;
  const { auth } = useAuth();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookDetails, setBookDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (auth.token) {
      try {
        const response = await fetch(`${baseURL}/api/User/perfil`, {
          headers: {
            "Authorization": `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario.");
        }

        const data = await response.json();
        setUserData(data);

        const ordersResponse = await fetch(`${baseURL}/api/User/historial`, {
          headers: {
            "Authorization": `Bearer ${auth.token}`,
          },
        });

        if (!ordersResponse.ok) {
          throw new Error("Error al obtener el historial de compras.");
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        const bookIds = ordersData.flatMap(order =>
          order.detalles.map(item => item.idLibro)
        );
        if (bookIds.length > 0) {
          const uniqueBookIds = [...new Set(bookIds)];
          const bookDetailsPromises = uniqueBookIds.map(idLibro =>
            fetch(`${baseURL}/api/Libro/Detalle/${idLibro}`).then(res => res.json())
          );
          const bookDetailsData = await Promise.all(bookDetailsPromises);
          const bookDetailsMap = bookDetailsData.reduce((acc, book) => {
            acc[book.idLibro] = book;
            return acc;
          }, {});
          setBookDetails(bookDetailsMap);
        }

      } catch (error) {
        console.error("Error al obtener datos del perfil o historial de pedidos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth.token]);

  const handleUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  if (loading) return <p>Cargando...</p>;

  if (!auth.token) return <p>No estás autenticado.</p>;

  return (
    <div className="container">
      <h1>Perfil de Usuario</h1>
      {userData ? (
        <div className="profile-info">
          <h2>Datos del Usuario</h2>
          <p><strong>Nombre:</strong> {userData.nombre} {userData.apellidos}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Dirección:</strong> {userData.direccion}</p>
          <p><strong>Rol:</strong> {userData.rol}</p>
          <div className="profile-buttons">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btnComprar"
              label="Editar Perfil"
            />
          </div>
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}

      <ModalEditarPerfil
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
        onUpdate={handleUpdate}
      />

      <h2>Historial de Compras</h2>
      {orders.length > 0 ? (
        <div className="orders-list">
          <ul>
            {orders.map((order) => (
              <li key={order.idCompra}>
                <p><strong>Pedido ID:</strong> {order.idCompra}</p>
                <p><strong>Fecha:</strong> {new Date(order.fechaCompra).toLocaleDateString()}</p>
                <div>
                  <strong>Libros:</strong>
                  {order.detalles.length > 0 ? (
                    <ul>
                      {order.detalles.map((item, index) => {
                        const book = bookDetails[item.idLibro];
                        return (
                          <Link to={`/producto/${item.idLibro}`}>
                            <li key={index} className="order-details">
                              <img src={book ? book.urlImagen : ''} alt={book ? book.nombre : ''} />
                              <div>
                                <p><strong>Nombre:</strong> {book ? book.nombre : 'Cargando...'}</p>
                                <p><strong>Autor:</strong> {book ? book.autor : 'Cargando...'}</p>
                                <p><strong>Precio:</strong> {(item.precioUnitario / 100).toFixed(2)} €</p>
                              </div>
                            </li>
                          </Link>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No hay libros en este pedido.</p>
                  )}
                </div>
                <p className="order-total">
                  <strong>Total:</strong>
                  {
                    (order.detalles.reduce((total, item) => {
                      return total + item.cantidad * (item.precioUnitario / 100);
                    }, 0)).toFixed(2)
                  } €
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tienes pedidos realizados.</p>
      )}
    </div>
  );
};

export default Perfil;
