import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/Libro/Detalle/${id}`
        );
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setProducto(data.libro);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!producto) {
    return <p>Producto no encontrado.</p>;
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
              {producto.stock > 0 ? "En stock" : "Agotado"}
            </p>
            <p className="valoracion">
              Valoración Media: {producto.valoracionMedia}
            </p>

            <Button
              label="Comprar"
              styleType="btnComprar"
              onClick={(e) => {
                e.stopPropagation();
                alert("Compra realizada");
              }}
            />
            <Button
              label="Añadir a la cesta"
              styleType="btnAñadir"
              onClick={(e) => {
                e.stopPropagation();
                alert("Añadido a la cesta");
              }}
            />
          </div>
        </div>

        <hr />
        <div className="reseñas texto-pequeño">
          <h2 className="texto-grande">Reseñas</h2>
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
