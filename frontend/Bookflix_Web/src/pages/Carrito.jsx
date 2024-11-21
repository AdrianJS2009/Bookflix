import { useEffect } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/Carrito.css";

const Carrito = () => {
  const { items, vaciarCarrito } = useCarrito();
  const { auth } = useAuth();

  const handleCompra = () => {
    if (!auth.usuario) {
      alert("Inicia sesión para realizar la compra");
    } else {
      alert("Compra realizada con éxito");
      vaciarCarrito();
    }
  };

  useEffect(() => {
    console.log("Carrito actualizado", items);
  }, [items]);

  return (
    <div className="carrito">
      <Header />
      <main>
        <h1>Carrito de compras</h1>
        {items.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <ul className="carrito-lista">
            {items.map((item, index) => (
              <li key={index} className="carrito-item">
                <img src={item.urlImagen || "placeholder.jpg"} alt={item.nombreLibro} className="carrito-item-imagen" />
                <div className="carrito-item-info">
                  <h3>{item.nombreLibro}</h3>
                  <p>Precio: €{(item.subtotal / item.cantidad).toFixed(2)}</p>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Subtotal: €{item.subtotal.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button onClick={handleCompra} disabled={items.length === 0}>
          Comprar
        </Button>
        <Button onClick={vaciarCarrito} disabled={items.length === 0}>
          Vaciar Carrito
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default Carrito;