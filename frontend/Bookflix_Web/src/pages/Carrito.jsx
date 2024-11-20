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
  cargarCarritoDesdeLocalStorage,
} from "../redux/slices/carritoSlice";
import "../styles/Carrito.css";

const Carrito = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCarritoItems);
  const usuario = useSelector(selectUsuario);
  const token = useSelector(selectToken);

  useEffect(() => {
    dispatch(cargarCarritoDesdeLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    if (usuario && token) {
      dispatch(cargarCarrito(usuario.id));
    if (!usuario || !usuario.id || !token) {
      console.warn("El usuario o token no están definidos correctamente.");
      console.log("Usuario actual:", usuario);
      console.log("Token actual:", token);
      return;
    }

    dispatch(cargarCarrito(usuario.id));
  } 
},[usuario, token, dispatch]);

  console.log("Usuario actual:", usuario);
  console.log("Token actual:", token);

  const handleClearCart = () => {
    dispatch(limpiarCarrito());
    alert("El carrito ha sido vaciado.");
  };

  const eliminarItemCarrito = async (itemId) => {
    if (!usuario || !usuario.id) {
      console.error(
        "No se puede eliminar el producto porque el usuario no está definido."
      );
      return;
    }

    if (!itemId || typeof itemId !== "number") {
      console.error("El itemId proporcionado no es válido:", itemId);
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7182/api/Carrito/eliminar/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        console.log("Item eliminado del carrito");
        dispatch(cargarCarrito(usuario.id)); // Actualizar el estado del carrito
      } else {
        const data = await response.json();
        console.error(
          "Error eliminando el artículo:",
          data.error || data.message
        );
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error.message);
    }
  };

  const registrarCompra = async () => {
    // if (!usuario || !token) {
    //   alert("Debes iniciar sesión para realizar esta acción.");
    //   navigate("/login");
    //   return;
    // }

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
