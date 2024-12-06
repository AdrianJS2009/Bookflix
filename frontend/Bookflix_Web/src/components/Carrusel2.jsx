import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/ProductoDetalle.css"
import "../styles/catalogo.css";
import "../styles/catalogoQuerys.css";
import classes from "./styles/Carrusel2.module.css";

const Carrusel2 = () => {
  const baseURL = import.meta.env.VITE_SERVER_API_BASE_URL;
  const [libros, setLibros] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useCarrito();

  const fetchLibrosCarrusel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/Libro/ItemsCarrusel`);
      if (!response.ok) {
        throw new Error("Error al obtener los libros del carrusel");
      }
      const data = await response.json();
      setLibros(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregar = (libro) => {
    if (libro && libro.stock > 0) {
      agregarAlCarrito(
        {
          idLibro: libro.idLibro,
          nombre: libro.nombre,
          precio: libro.precio,
          urlImagen: libro.urlImagen,
        },
        1
      );
    }
  };

  useEffect(() => {
    fetchLibrosCarrusel();
  }, []);

  const nextSlide = () => {
    if (currentIndex < libros.length - 2) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section id="novedades">
      <div className={classes.carruselContainer}>
        <div className={classes.carruselWrapper}>
          <button onClick={prevSlide} className={classes.prevBtn}>
            ◀
          </button>
          <ul
            className={classes.listaElementos}
            style={{
              transform: `translateX(-${currentIndex * 536}px)`,
            }}
          >
            {libros.map((libro) => (
              <li key={libro.idLibro} className="catalogoItem">
                <div className="catalogoItemContent">
                  <img
                    src={libro.urlImagen}
                    alt={`Portada de ${libro.nombre}`}
                    className="imgItemCatalogo"
                  />
                </div>
                <div className="catalogoItemButtons">
                  <NavLink to={`/producto/${libro.idLibro}`}>
                    <h2 className="titulo">
                      {Array.from(libro.nombre).length > 10
                        ? Array.from(libro.nombre).slice(0, 50).join("") + "..."
                        : libro.nombre}
                    </h2>

                    <p className="precio">{libro.autor}</p>
                    <p className="precio">{(libro.precio / 100).toFixed(2)} €</p>
                    <p className="precio">
                    {libro.stock > 0 ? (
                      <span>
                        <span className="existencias">⬤</span> En stock
                      </span>
                    ) : (
                      <span>
                        <span className="agotado">⬤</span> Agotado
                      </span>
                    )} - ⭐{libro.promedioEstrellas}
                  </p>
                  </NavLink>
                </div>
                <Button
                  label="Añadir a la cesta"
                  styleType="btnAñadir"
                  onClick={() => handleAgregar(libro)}
                />
              </li>
            ))}
          </ul>
          <button onClick={nextSlide} className={classes.nextBtn}>
            ▶
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carrusel2;
