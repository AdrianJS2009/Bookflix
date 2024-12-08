import { NavLink } from "react-router-dom";
import classes from "./styles/Topventas.module.css";

export default function TopVentas() {
  return (
    <section id="top-ventas" className={classes.topVentasSection}>
      <div className="libro">
        <NavLink to="/producto/1">
          <img
            src="/assets/libros/1.png"
            className={classes.libroImagen}
            alt="Libro 1"
          />
        </NavLink>
        <img
          src="/assets/numeros/1.png"
          className={classes.puestoImagen}
          alt="Puesto 1"
        />
      </div>
      <div className="libro">
        <NavLink to="/producto/2">
          <img
            src="/assets/libros/2.png"
            className={classes.libroImagen}
            alt="Libro 2"
          />
        </NavLink>
        <img
          src="/assets/numeros/2.png"
          className={classes.puestoImagen}
          alt="Puesto 2"
        />
      </div>
      <div className="libro">
        <NavLink to="/producto/3">
          <img
            src="/assets/libros/3.png"
            className={classes.libroImagen}
            alt="Libro 3"
          />
        </NavLink>
        <img
          src="/assets/numeros/3.png"
          className={classes.puestoImagen}
          alt="Puesto 3"
        />
      </div>
    </section>
  );
}
