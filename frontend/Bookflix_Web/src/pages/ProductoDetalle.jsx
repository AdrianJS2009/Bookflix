import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { agregarProducto } from "../redux/slices/carritoSlice";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const dispatch = useDispatch();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [textoReseña, setTextoReseña] = useState("");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/Libro/Detalle/${productoId}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del producto");
        }
        const data = await response.json();
        setProducto(data.libro);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducto();
  }, [productoId]);

  const cambiarCantidad = (accion) => {
    setCantidad((prevCantidad) =>
      accion === "incrementar"
        ? prevCantidad + 1
        : Math.max(prevCantidad - 1, 1)
    );
  };

  const handleAddToCart = () => {
    if (producto) {
      dispatch(agregarProducto({ ...producto, cantidad }));
      alert("Producto añadido al carrito");
    }
  };

  const handleChange = (e) => {
    setTextoReseña(e.target.value);
  };

  const handleCrearReseña = () => {
    if (textoReseña.trim()) {
      console.log("Reseña creada:", textoReseña);
      setTextoReseña("");
    } else {
      console.log("Escribe una reseña antes de enviar");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!producto) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Header />
      <div className="productoDetalle">
        <p className="volverAtras texto-pequeño">
          <Link to="/catalogo">◄◄ Volver al catálogo</Link>
        </p>
        <div className="principal">
          <div className="imagenContainer">
            <img
              src={producto.urlImagen}
              alt={producto.nombre}
              className="imagen"
            />
          </div>
          <div className="info texto-mediano">
            <h1 className="texto-grande">{producto.nombre}</h1>
            <p className="autor">Autor: {producto.autor}</p>
            <p className="descripcion">
              Descripción: <br /> {producto.descripcion}
            </p>
            <p className="generoLibro">
              Género:{" "}
              <Link to={`/catalogo?genero=${producto.genero}`}>
                <span className="genero"> {producto.genero} </span>
              </Link>
            </p>
            <p className="isbn texto-pequeño">ISBN: {producto.isbn}</p>
          </div>
          <div className="detalles texto-mediano">
            <p className="precio">
              Precio: €{(producto.precio / 100).toFixed(2)}
            </p>
            <p className="stock">
              {producto.stock > 0 ? (
                <span>
                  <span className="existencias">⬤</span> En stock
                </span>
              ) : (
                <span>
                  <span className="agotado">⬤</span> Agotado
                </span>
              )}
            </p>
            <div className="cantidad">
              <button
                className="masCantidad"
                onClick={() => cambiarCantidad("decrementar")}
              >
                -
              </button>
              <input type="number" value={cantidad} readOnly />
              <button
                className="menosCantidad"
                onClick={() => cambiarCantidad("incrementar")}
              >
                +
              </button>
            </div>
            <Button
              label="Comprar"
              styleType="btnComprar"
              onClick={() => alert("Compra realizada")}
            />
            <Button
              label="Añadir a la cesta"
              styleType="btnAñadir"
              onClick={handleAddToCart}
            />
          </div>
        </div>
        <hr />
        <div className="reseñas texto-pequeño">
          <h2 className="texto-grande">Reseñas</h2>
          <div className="crearReseña">
            <input
              className="textoReseñaNueva"
              value={textoReseña}
              onChange={handleChange}
              placeholder="Escribe tu reseña aquí..."
            />
            <button className="btnCrearReseña" onClick={handleCrearReseña}>
              Crear
            </button>
          </div>
          {producto.reseñas && producto.reseñas.length > 0 ? (
            producto.reseñas.map((reseña, index) => (
              <div key={index} className="reseña">
                <p>Autor: {reseña.autor}</p>
                <p>Estrellas: {"⭐".repeat(reseña.estrellas)}</p>
                <p>{reseña.texto}</p>
              </div>
            ))
          ) : (
            <p>No hay reseñas para este producto.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductoDetalle;
