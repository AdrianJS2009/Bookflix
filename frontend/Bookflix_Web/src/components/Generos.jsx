import { NavLink } from "react-router-dom";
import "../styles/default.css";
import classes from "./styles/Generos.module.css";

const Generos = () => {
  return (
    <section id="generos" href="generos">
      <div className={classes.generosContainer}>
        <NavLink
          to="/ciencia-ficcion"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.cienciaFiccion}`}>
            <p>Ciencia Ficción</p>
          </div>
        </NavLink>
        <NavLink
          to="/fantasia"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.fantasia}`}>
            <p>Fantasía</p>
          </div>
        </NavLink>
        <NavLink
          to="/terror"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.terror}`}>
            <p>Terror</p>
          </div>
        </NavLink>
        <NavLink
          to="/misterio"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.misterio}`}>
            <p>Misterio</p>
          </div>
        </NavLink>
        <NavLink
          to="/thriller"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.thriller}`}>
            <p>Thriller</p>
          </div>
        </NavLink>
        <NavLink
          to="/romance"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.romance}`}>
            <p>Romance</p>
          </div>
        </NavLink>
        <NavLink
          to="/biografia"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.biografia}`}>
            <p>Biografía</p>
          </div>
        </NavLink>
        <NavLink
          to="/historicos"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.historicos}`}>
            <p>Históricos</p>
          </div>
        </NavLink>
        <NavLink
          to="/historicos"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.historicos}`}>
            <p>Cinéfilos</p>
          </div>
        </NavLink>
        <NavLink
          to="/historicos"
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.historicos}`}>
            <p>Novelas</p>
          </div>
        </NavLink>
      </div>
    </section>
  );
};

export default Generos;
