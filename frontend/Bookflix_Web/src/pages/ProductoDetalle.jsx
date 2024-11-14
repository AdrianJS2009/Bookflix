import { useDispatch } from "react-redux";
import { agregarProducto } from "../redux/slices/carritoSlice";

const ProductoDetalle = ({ producto }) => {
  const dispatch = useDispatch();

  const handleAgregarAlCarrito = () => {
    if (producto.stock > 0) {
      dispatch(agregarProducto(producto));
    } else {
      alert("Producto sin stock disponible.");
    }
  };

  return (
    <div className="producto-detalle-container">
      <h2>{producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} />
      <p>{producto.descripcion}</p>
      <p>Precio: €{producto.precio}</p>
      <p>{producto.stock > 0 ? "En stock" : "Sin stock"}</p>
      <button onClick={handleAgregarAlCarrito}>Agregar al Carrito</button>
    </div>
  );
};

export default ProductoDetalle;
