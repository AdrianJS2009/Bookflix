import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { selectToken, selectUsuario } from "../redux/slices/authSlice";
import {
  cargarCarrito,
  cargarCarritoDesdeStorage,
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
    dispatch(cargarCarritoDesdeStorage());
    if (usuario && token) {
      dispatch(cargarCarrito(usuario.id));
    }
  }, [usuario, token, dispatch]);

  const handleClearCart = () => {
    dispatch(limpiarCarrito());
    alert("El carrito ha sido vaciado.");
  };

  const eliminarItemCarrito = async (itemId) => {
    if (!usuario || !usuario.id) {
      console.error("Usuario no definido, no se puede eliminar el producto.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7182/api/Carrito/eliminar/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch(cargarCarrito(usuario.id));
      } else {
        console.error("Error eliminando el artículo.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error.message);
    }
  };

  const registrarCompra = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para realizar esta acción.");
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

      if (response.ok) {
        alert("Compra registrada con éxito.");
      } else {
        alert("Error al registrar la compra.");
      }
    } catch (error) {
      console.error("Error al registrar la compra:", error.message);
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
                  onClick={() => eliminarItemCarrito(item.productoId)}
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
          className="botonVaciar"
          onClick={handleClearCart}
        />
        {"  "}
        <Button
          label="Comprar"
          styleType="btnComprar"
          className="botonComprar"
          onClick={registrarCompra}
        />
      </div>
      <Footer />
    </>
  );
};

export default Carrito;
