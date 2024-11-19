import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
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

  return (
    <div className="carrito-contenedor">
      <h1>Carrito de Compras</h1>
      {items.length === 0 ? (
        <p>No hay artículos en el carrito.</p>
      ) : (
        <div className="carrito-items">
          {items.map((item, index) => (
            <div key={index} className="carrito-item">
              <img
                src={item.urlImagen || "placeholder.jpg"}
                alt={`Portada de ${item.nombre || "undefined"}`}
                className="carrito-imagen"
              />
              <div className="carrito-info">
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
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        label="Vaciar Carrito"
        styleType="btnDefault"
        onClick={handleClearCart}
      />
    </div>
  );
};

export default Carrito;
