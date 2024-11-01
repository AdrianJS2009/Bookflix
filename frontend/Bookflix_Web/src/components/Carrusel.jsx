import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import classes from "./styles/Carrusel.module.css";
import Button from "./Button";

const Carrusel = () => {
  const [indiceActual, setIndiceActual] = useState(0);
  const libros = [
    { id: 1, titulo: "Invisible", precio: "9,00 €", imagen: "/assets/libros/1.png" },
    { id: 2, titulo: "Hábitos atómicos", precio: "9,00 €", imagen: "/assets/libros/2.png" },
    { id: 3, titulo: "Redes", precio: "9,00 €", imagen: "/assets/libros/3.png" },
    { id: 4, titulo: "Pokemon Enciclopedia", precio: "9,00 €", imagen: "/assets/libros/4.png" },
    { id: 5, titulo: "Libro 5", precio: "9,00 €", imagen: "/assets/libros/5.png" },
  ];

  const totalItems = libros.length;

  const moverCarrusel = (direccion) => {
    let nuevoIndice = indiceActual + direccion;

    if (nuevoIndice < 0) return;

    if (nuevoIndice > totalItems - 3) nuevoIndice = totalItems - 3;

    setIndiceActual(nuevoIndice);
  };

  return (
    <section id="novedades" href="novedades">
      <div className={classes.carruselContainer}>
        <button
          className={`${classes.flecha} ${classes.izquierda}`}
          onClick={() => moverCarrusel(-1)}
          disabled={indiceActual <= 0} // Desactivar si no hay más elementos
        >
          &#10094;
        </button>
        <div
          className={classes.carrusel}
          style={{ transform: `translateX(-${(indiceActual * 100) / 3}%)` }}
        >
          {libros.map((libro) => (
            <NavLink key={libro.id} to={`/libro/${libro.id}`} className="carrusel-item fondo-azul-claro texto-mediano" activeClassName="active">
              <img src={libro.imagen} alt={libro.titulo} />
              <h3>{libro.titulo}</h3>
              <p>{libro.precio}</p>
              <div className={classes.btnContainer}>
                <Button label="Comprar" styleType="btnComprar" onClick={() => alert('Compra realizada')} />
                <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={() => alert('Añadido a la cesta')} />
              </div>
            </NavLink>
          ))}
        </div>
        <button
          className={`${classes.flecha} ${classes.derecha}`}
          onClick={() => moverCarrusel(1)}
          disabled={indiceActual >= totalItems - 3} // Desactivar si no hay más elementos
        >
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default Carrusel;