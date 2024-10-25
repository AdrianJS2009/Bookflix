// src/components/Header.jsx
import React from 'react';
import '../styles/default.css';
import '../styles/header.css';

const Header = () => {
  return (
    <header className="header fondo-negro">
      <div className="nav-logo">
        <a href="#">
          <img src="/assets/logos/Logo-degradado-con bisel.png" className="logo-navbar" alt="Bookflix logo" />
        </a>
        <div className="user-cart texto-pequeño-bold">
          <a href="#">
            <img src="/assets/iconos/Logo Usuario.png" className="iconos" alt="" /> Usuario
          </a>
          <a href="#">
            <img src="/assets/iconos/Logo Cesta.png" className="iconos" alt="" /> Cesta
          </a>
        </div>
      </div>
      <nav className="nav-principal fondo-verde">
        <ul className="texto-pequeño-bold texto-negro">
          <li><a href="#">Novedades</a></li>
          <li><a href="#">Géneros</a></li>
          <li><a href="#">Top ventas</a></li>
          <li><a href="#">Bundles</a></li>
          <li><a href="#">Catálogo</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
