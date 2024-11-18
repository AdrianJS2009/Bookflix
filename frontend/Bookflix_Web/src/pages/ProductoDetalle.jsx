import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { selectToken, selectUsuario } from "../redux/slices/authSlice";
import { agregarAlCarritoLocal } from "../redux/slices/carritoSlice";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const dispatch = useDispatch();
  const usuario = useSelector(selectUsuario);
  const token = useSelector(selectToken);

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [textoReseña, setTextoReseña] = useState("");
  const [reseñas, setReseñas] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Libro/Detalle/${productoId}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del producto");
        }
        const data = await response.json();
        setProducto(data);
        setReseñas(data.reseñas || []); // Asegura que reseñas sea un array
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducto();
  }, [productoId]);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (usuario && token) {
        try {
          const response = await fetch(
            `https://localhost:7182/api/Libro/CheckPurchase/${usuario.id}/${productoId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setHasPurchased(data.hasPurchased);
          }
        } catch (err) {
          console.error("Error verificando compra:", err);
        }
      }
    };

    checkPurchaseStatus();
  }, [usuario, token, productoId]);

  const handleAddToCart = () => {
    if (producto && cantidad > 0) {
      dispatch(
        agregarAlCarritoLocal({
          productoId: producto.idLibro,
          cantidad,
        })
      );
    }
  };

  const handleReviewSubmit = async () => {
    if (textoReseña.trim() === "") return;

    try {
      const nuevaReseña = {
        texto: textoReseña,
        libroId: productoId,
      };

      const response = await fetch(
        `https://localhost:7182/api/Libro/clasificarReseña`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevaReseña),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la reseña");
      }

      const data = await response.json();
      setTextoReseña("");
      setReseñas((prevReseñas) => [
        { texto: textoReseña, categoria: data.categoria },
        ...prevReseñas,
      ]);
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
    }
  };

  if (error) {
    return <div className="volverAtras">{error}</div>;
  }

  if (!producto) {
    return <div className="volverAtras">Cargando detalles del producto...</div>;
  }

  return (
    <div className="detalle-contenido">
      <Header />
      <main className="principal">
        <img
          src={producto.urlImagen}
          alt={producto.nombre}
          className="imagen"
        />
        <div className="detalles">
          <h1>{producto.nombre}</h1>
          <p className="info">{producto.descripcion}</p>
          <p className="info genero">Género: {producto.genero}</p>
          <p className="info stock">
            Stock:{" "}
            {producto.stock > 0 ? (
              <span className="existencias">Disponible</span>
            ) : (
              <span className="agotado">Agotado</span>
            )}
          </p>
          <p className="info">Precio: {producto.precio}€</p>
          <hr />
          <div className="cantidad">
            <button
              className="menosCantidad"
              onClick={() => setCantidad(Math.max(cantidad - 1, 1))}
            >
              -
            </button>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(Number(e.target.value), 1))}
            />
            <button
              className="masCantidad"
              onClick={() => setCantidad(cantidad + 1)}
            >
              +
            </button>
          </div>
          <button onClick={handleAddToCart} className="carrito-boton">
            Añadir al carrito
          </button>
        </div>
      </main>
      <section className="crearReseña">
        {reseñas.length > 0 ? (
          reseñas.map((reseña, index) => (
            <div key={index}>
              <p>{reseña.texto}</p>
              <span>{reseña.categoria}</span>
            </div>
          ))
        ) : (
          <p>No hay reseñas aún.</p>
        )}
        {hasPurchased && (
          <div>
            <textarea
              placeholder="Escribe tu reseña aquí..."
              value={textoReseña}
              onChange={(e) => setTextoReseña(e.target.value)}
            />
            <button onClick={handleReviewSubmit}>Enviar Reseña</button>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ProductoDetalle;
