import React from "react";
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
  return (
    <section id="novedades" href="novedades">
      <div className={classes.carruselContainer}>
        <div className={classes.carruselWrapper}>
            <ul className={classes.listaElementos}>
                {libros.map((libro) => (
                    <li key={libro.id} className={`${classes.carruselElemento} texto-mediano`}>
                        <img src={libro.imagen} alt={libro.titulo} className={classes.imgElementoCarrusel}/>
                        <h3>{libro.titulo}</h3>
                        <p>{libro.precio}</p>
                        <div className={classes.btnContainer}>
                            <Button label="Comprar" styleType="btnComprar" onClick={() => alert('Compra realizada')} />
                            <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={() => alert('Añadido a la cesta')} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </section>
  );
};

export default Carrusel2;
