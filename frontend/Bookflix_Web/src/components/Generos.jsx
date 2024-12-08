import { Link } from "react-router-dom";
import "../styles/default.css";
import classes from "./styles/Generos.module.css";

const Generos = () => {
  return (
    <section id="generos" href="generos">
      <div className={classes.generosContainer}>
        <Link
          to={`/catalogo?genero=Literatura`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.cienciaFiccion}`}>
            <p>Ciencia Ficción</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Fantasía`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.fantasia}`}>
            <p>Fantasía</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Programación`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.terror}`}>
            <p>Terror</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Psicología`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.misterio}`}>
            <p>Misterio</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Thriller`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.thriller}`}>
            <p>Thriller</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Narrativa`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.romance}`}>
            <p>Romance</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Ilustrado`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.biografia}`}>
            <p>Biografía</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Historia`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.historicos}`}>
            <p>Históricos</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Espiritualidad`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.cinefilos}`}>
            <p>Cinéfilos</p>
          </div>
        </Link>
        <Link
          to={`/catalogo?genero=Novela`}
          className="texto-mediano-bold texto-blanco"
          activeClassName="active"
        >
          <div className={`${classes.genero} ${classes.novelas}`}>
            <p>Novelas</p>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Generos;
