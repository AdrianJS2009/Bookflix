import React from "react";

import "../styles/default.css";
import classes from "./styles/Generos.module.css";

const Generos = () => {
  return (
    <section id="generos" href="generos">
      <div className={classes.generosContainer}>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.cienciaFiccion}`}>
            <p>Ciencia Ficción</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.fantasia}`}>
            <p>Fantasía</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.terror}`}>
            <p>Terror</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.misterio}`}>
            <p>Misterio</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.thriller}`}>
            <p>Thriller</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.romance}`}>
            <p>Romance</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.biografia}`}>
            <p>Biografía</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.historicos}`}>
            <p>Históricos</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.cinefilos}`}>
            <p>Cinéfilos</p>
          </div>
        </a>
        <a href="" className="texto-mediano-bold texto-blanco">
          <div className={`${classes.genero} ${classes.novelas}`}>
            <p>Novelas</p>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Generos;
