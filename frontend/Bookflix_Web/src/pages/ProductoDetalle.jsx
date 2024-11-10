import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "../components/styles/ProductoDetalle.module.css";

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
    <div className={classes.productoDetalle}>
      <div className={classes.imagenContainer}>
        <img
          src={producto.urlImagen}
          alt={producto.nombre}
          className={classes.imagen}
        />
      </div>
      <div className={classes.detalles}>
        <h1>{producto.nombre}</h1>
        <p className={classes.descripcion}>{producto.descripcion}</p>
        <p className={classes.precio}>Precio: €{producto.precio}</p>
        <p className={classes.stock}>
          {producto.stock > 0 ? "En stock" : "Agotado"}
        </p>
        <p className={classes.valoracion}>
          Valoración Media: {producto.valoracionMedia}
        </p>

        <h2>Reseñas</h2>
        {producto.reseñas && producto.reseñas.length > 0 ? (
          producto.reseñas.map((reseña, index) => (
            <div key={index} className={classes.reseña}>
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
  );
};

export default ProductoDetalle;
