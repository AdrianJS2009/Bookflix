import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductoDetalle.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los datos del producto desde el backend
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/Libro/Detalle/${id}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del producto");
        }
        const data = await response.json();
        setProducto(data);
      } catch (error) {
        if (!producto) {
          return <p>Producto no encontrado.</p>;
        }
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
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

        <div className="principal">
          <div className="imagenContainer">
            <img
              src={producto.urlImagen}
              alt={producto.nombre}
              className="imagen"
            />
          </div>
          <div className="info">
            <h1>{producto.nombre}</h1>
            <p className="descripcion">{producto.descripcion}</p>
            <p className="isbn">{producto.isbn}</p>
          </div>
          <div className="detalles">           
            <p className="precio">Precio: €{(producto.precio / 100).toFixed(2)}</p>
            <p className="stock">
              {producto.stock > 0 ? "En stock" : "Agotado"}
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

        <div className="reseñas">
          
          <p className="valoracion">
            Valoración Media: {producto.valoracionMedia}
          </p>

          <h2>Reseñas</h2>
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
