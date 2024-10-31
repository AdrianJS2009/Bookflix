import React from "react";

export default function TopVentas(){
  return (
    <section id="top-ventas" className="top-ventas-section">
      <div className="libro">
          <img src="/assets/libros/1.png" className="libro-imagen" />
          <img src="/assets/numeros/1.png" className="puesto-imagen" />
      </div>
      <div className="libro">
          <img src="/assets/libros/2.png" className="libro-imagen" />
          <img src="/assets/numeros/2.png" className="puesto-imagen" />
      </div>
      <div className="libro">
          <img src="/assets/libros/3.png" className="libro-imagen" />
          <img src="/assets/numeros/3.png" className="puesto-imagen" />
      </div>
    </section>
  );
}