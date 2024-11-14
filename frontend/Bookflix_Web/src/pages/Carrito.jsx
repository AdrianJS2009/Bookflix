import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { vaciarCarrito } from "../redux/slices/carritoSlice";

const Carrito = () => {
  const { productos } = useSelector((state) => state.carrito);
  const { usuario } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Enviar el carrito al servidor si el usuario está autenticado
  useEffect(() => {
    if (usuario) {
      const enviarCarrito = async () => {
        try {
          const response = await fetch(
            `/api/carrito/${usuario.id}/actualizar`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${usuario.token}`,
              },
              body: JSON.stringify(productos),
            }
          );
          if (!response.ok) {
            throw new Error("Error al sincronizar el carrito.");
          }
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
        }
      };
      enviarCarrito();
    }
  }, [usuario, productos]);

  const handleVaciarCarrito = () => {
    dispatch(vaciarCarrito());
  };

  const handleCheckout = () => {
    if (usuario) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="carrito-container">
      <h2>Carrito de Compras</h2>
      {productos.length > 0 ? (
        <div>
          {productos.map((producto) => (
            <div key={producto.id} className="carrito-item">
              <p>{producto.nombre}</p>
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
  );
};

export default Carrito;
