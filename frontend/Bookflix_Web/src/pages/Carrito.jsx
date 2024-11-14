import React from "react";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< Updated upstream
import { limpiarCarrito } from "../redux/slices/carritoSlice"; // Corrected import for `limpiarCarrito`
=======
import { useNavigate } from "react-router-dom";
import { vaciarCarrito } from "../redux/slices/carritoSlice";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/default.css"
import "../styles/carrito.css";

>>>>>>> Stashed changes

const Carrito = () => {
  const dispatch = useDispatch();
  const carritoItems = useSelector((state) => state.carrito.items);

  const handleClearCart = () => {
    dispatch(limpiarCarrito()); // Corrected usage of `limpiarCarrito`
  };

  return (
<<<<<<< Updated upstream
    <div>
      <h1>Carrito de Compras</h1>
      {carritoItems.length > 0 ? (
        <div>
          <ul>
            {carritoItems.map((item) => (
              <li key={item.idLibro}>
                {item.nombre} - Cantidad: {item.cantidad}
              </li>
            ))}
          </ul>
          <button onClick={handleClearCart}>Vaciar Carrito</button>
        </div>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
=======
    <>
      <Header />
      <div className="carrito-container texto-pequeño">
        <h2 className="texto-grande">Carrito de Compras</h2>
        {productos.length > 0 ? (
          <div>
            {productos.map((producto) => (
              <div key={producto.id} className="carrito-item">
                <img src={producto.urlImagen} alt={`Portada de ${producto.nombre}`} className="imagenProducto" />
                <p>{producto.nombre}</p>
                <p>Precio: {(producto.precio / 100).toFixed(2)} €</p>
                <p>Cantidad: {producto.cantidad}</p>
              </div>
            ))}
            <button onClick={handleVaciarCarrito}>Vaciar Carrito</button>
            <button onClick={handleCheckout}>Proceder a la Compra</button>
          </div>
        ) : (
          <p>El carrito está vacío.</p>
        )}
      </div>
      <Footer />
    </>
>>>>>>> Stashed changes
  );
};

export default Carrito;
