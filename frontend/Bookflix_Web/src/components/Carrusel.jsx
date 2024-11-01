import React, { useState } from "react";

const Carrusel = () => {
  const [indiceActual, setIndiceActual] = useState(0);
  const libros = [
    { id: 1, titulo: "Libro 1", precio: "$10", imagen: "/assets/libros/1.png" },
    { id: 2, titulo: "Libro 2", precio: "$15", imagen: "/assets/libros/2.png" },
    { id: 3, titulo: "Libro 3", precio: "$20", imagen: "/assets/libros/3.png" },
    { id: 4, titulo: "Libro 4", precio: "$12", imagen: "/assets/libros/4.png" },
    { id: 5, titulo: "Libro 5", precio: "$18", imagen: "/assets/libros/5.png" },
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
      <div className="carrusel-container">
        <button
          className="flecha izquierda"
          onClick={() => moverCarrusel(-1)}
          disabled={indiceActual === 0} // Desactivar si es el primer índice
        >
          &#10094;
        </button>
        <div
          className="carrusel"
          style={{ transform: `translateX(-${(indiceActual * 100) / 3}%)` }}
        >
          {libros.map((libro) => (
            <div key={libro.id} className="carrusel-item fondo-azul-claro">
              <img src={libro.imagen} alt={libro.titulo} />
              <h3>{libro.titulo}</h3>
              <p>{libro.precio}</p>
              <div className="btn-container">
                <button className="btn-comprar fondo-azul">
                  <span className="texto-blanco texto-mediano">Comprar</span>
                </button>
                <button className="btn-anadir fondo-verde">
                  <span className="texto-blanco texto-mediano">
                    Añadir a la cesta
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="flecha derecha"
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
