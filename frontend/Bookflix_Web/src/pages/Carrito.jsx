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
                {item.nombre}
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
