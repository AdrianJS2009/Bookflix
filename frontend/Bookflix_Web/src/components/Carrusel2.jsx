import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import classes from "./styles/Carrusel2.module.css";
import Button from "./Button";

const Carrusel2 = () => {
  const libros = [
    { id: 1, titulo: "Invisible", precio: "9,00 €", imagen: "/assets/libros/1.png" },
    { id: 2, titulo: "Hábitos atómicos", precio: "9,00 €", imagen: "/assets/libros/2.png" },
    { id: 3, titulo: "Redes", precio: "9,00 €", imagen: "/assets/libros/3.png" },
    { id: 4, titulo: "Pokemon Enciclopedia", precio: "9,00 €", imagen: "/assets/libros/4.png" },
    { id: 5, titulo: "Libro 5", precio: "9,00 €", imagen: "/assets/libros/5.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <section id="novedades">
      <div className={classes.carruselContainer}>
        <div className={classes.carruselWrapper}>
        <button onClick={prevSlide} className={classes.prevBtn}>◀</button>
          <ul
            className={classes.listaElementos}
            style={{
              transform: `translateX(-${currentIndex * 536}px)`,
            }}
          >
            {libros.map((libro) => (
              <li key={libro.id} className={classes.carruselElemento}>
                <NavLink to={`/libro/${libro.id}`}>
                  <img src={libro.imagen} alt={libro.titulo} className={classes.imgElementoCarrusel} />
                  <h3>{libro.titulo}</h3>
                  <p>{libro.precio}</p>
                </NavLink>
                <div className={classes.btnContainer}>
                  <Button label="Comprar" styleType="btnComprar" onClick={() => alert("Compra realizada")} />
                  <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={() => alert("Añadido a la cesta")} />
                </div>
              </li>
            ))}
          </ul>
          <button onClick={nextSlide} className={classes.nextBtn}>▶</button>
        </div>
      </div>
    </section>
  );
};

export default Carrusel2;
