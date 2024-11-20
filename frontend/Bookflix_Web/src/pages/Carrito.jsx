import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { selectToken, selectUsuario } from "../redux/slices/authSlice";
import {
  cargarCarrito,
  limpiarCarrito,
  selectCarritoItems,
} from "../redux/slices/carritoSlice";
import "../styles/Carrito.css";

const Carrito = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCarritoItems);
  const usuario = useSelector(selectUsuario);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (usuario && token) {
      dispatch(cargarCarrito(usuario.id));
    }
  }, [usuario, token, dispatch]);

  const handleClearCart = () => {
    dispatch(limpiarCarrito());
    alert("El carrito ha sido vaciado.");
  };

  const eliminarItemCarrito = async (itemId) => {
    try {
      const response = await fetch(
        `https://localhost:7182/api/Carrito/eliminar/${itemId}`, // URL corregida
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token del usuario autenticado
          },
        }
      );

      if (response.ok) {
        console.log("Item eliminado del carrito");
        dispatch(cargarCarrito(usuario.id)); // Recargar el carrito después de eliminar
      } else {
        const data = await response.json();
        console.error(
          "Error eliminando el artículo",
          data.error || data.message
        );
      }
    } catch (error) {
      console.error("Error al hacer la solicitud", error);
    }
  };

  const registrarCompra = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7182/api/Carrito/${usuario.id}/comprar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error al registrar la compra: ${errorData.error}`);
        return;
      }

      alert("Compra registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar la compra:", error.message);
      alert("Error al registrar la compra. Intenta nuevamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="carrito-container texto-pequeño">
        <h1 className="texto-grande">Carrito de Compras</h1>
        {items.length === 0 ? (
          <p>No hay artículos en el carrito.</p>
        ) : (
          <div className="carrito-items">
            {items.map((item, index) => (
              <div key={index} className="carrito-item">
                <img
                  src={item.urlImagen || "placeholder.jpg"}
                  alt={`Portada de ${item.nombre || "undefined"}`}
                  className="imagenProducto"
                />
                <p>
                  <strong>{item.nombre || "Producto sin nombre"}</strong>
                </p>
                <p>
                  Precio:{" "}
                  {(item.precio / 100 || 0).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
                <p>Cantidad: {item.cantidad}</p>

                <button
                  className="botonEliminar"
                  onClick={(e) => eliminarItemCarrito(e, item.idLibro)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
        <Button
          label="Vaciar Carrito"
          styleType="btnDefault"
          onClick={handleClearCart}
        />
        {"  "}
        <Button
          label="Comprar"
          styleType="btnComprar"
          onClick={registrarCompra}
        />
      </div>
      <Footer />
    </>
  );
};

export default Carrito;
