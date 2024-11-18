import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/carrito.css";
import "../styles/default.css";

const Carrito = () => {
  const dispatch = useDispatch();
  const carritoItems = useSelector((state) => state.carrito.items);

  const handleClearCart = () => {
    dispatch(limpiarCarrito());
  };

  return (
    <>
      <Header />
      <div className="carrito-container texto-pequeño">
        <h1 className="texto-grande">Carrito de Compras</h1>
        {carritoItems.length > 0 ? (
          <div>
            <ul>
              {carritoItems.map((item) => (
                <li key={item.idLibro} className="carrito-item">
                  <img
                    src={item.urlImagen}
                    alt={`Portada de ${item.nombre}`}
                    className="imagenProducto"
                  />
                  <p>{item.nombre}</p>
                  <p>Precio: {(item.precio / 100).toFixed(2)} €</p>
                  <p>Cantidad: {item.cantidad}</p>
                </li>
              ))}
            </ul>
            <button onClick={handleClearCart}>Vaciar Carrito</button>
          </div>
        ) : (
          <p>El carrito está vacío.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Carrito;
