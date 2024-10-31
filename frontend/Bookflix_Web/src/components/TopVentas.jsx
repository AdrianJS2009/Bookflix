import React from "react";
import classes from "./styles/Topventas.module.css";

export default function TopVentas(){
  return (
    <section id="top-ventas" className={classes.topVentasSection}>
      <div className="libro">
          <img src="/assets/libros/1.png" className={classes.libroImagen} />
          <img src="/assets/numeros/1.png" className={classes.puestoImagen} />
      </div>
      <div className="libro">
          <img src="/assets/libros/2.png" className={classes.libroImagen} />
          <img src="/assets/numeros/2.png" className={classes.puestoImagen} />
      </div>
      <div className="libro">
          <img src="/assets/libros/3.png" className={classes.libroImagen} />
          <img src="/assets/numeros/3.png" className={classes.puestoImagen} />
      </div>
    </section>
  );
}