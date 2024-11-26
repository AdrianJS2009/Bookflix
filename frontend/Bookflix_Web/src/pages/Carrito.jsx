import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/Carrito.css";

const Carrito = () => {
  const { items, vaciarCarrito, eliminarItem } = useCarrito();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const cartCount = Array.isArray(items)
    ? items.reduce((total, item) => total + item.cantidad, 0)
    : 0;

  const handleCompra = () => {
    if (!auth.usuario) {
      alert("Inicia sesión para realizar la compra");
    } else {
      alert("Compra realizada con éxito");
      const total = items.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
      vaciarCarrito();
      navigate("/confirmacion-compra", { state: { items, total } });
    }
  };

  const handleEliminarItem = (libroId) => {
    eliminarItem(libroId);
  };

  return (
    <main className="carrito-container texto-pequeño">
      <h1 className="texto-grande">Carrito de compras</h1>
      {items.length === 0 ? (
        <p className="texto-pequeño">Tu carrito está vacío.</p>
      ) : (
        <ul className="carrito-lista">
          {items.map((item, index) => {
            console.log("Item en carrito:", item);
            return (
              <li key={index} className="carrito-item">
                <img
                  src={item.urlImagen || "placeholder.jpg"}
                  alt={`Imagen de ${item.nombre || "Producto"}`}
                  className="imagen-carrito"
                />
                <p>{item.nombre || "Sin nombre"}</p>
                <p>Cantidad: {item.cantidad}</p>
                <p>Precio: {(item.precio / 100).toFixed(2)} €</p>
                <p>
                  Subtotal: {((item.precio * item.cantidad) / 100).toFixed(2)} €
                </p>
                <button className="botonEliminar" onClick={() => handleEliminarItem(item.libroId)}>
                  Eliminar
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <Button label="Vaciar Carrito" className="botonVaciar" onClick={vaciarCarrito} />
      <Button label="Comprar" className="botonComprar" onClick={handleCompra} />
    </main>
  );
};

export default Carrito;
