import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Componentes
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carrusel from '../components/Carrusel';
import Generos from '../components/Generos';
import BannerUnete from '../components/BannerUnete';
import BannerEnvio from '../components/BannerEnvio';
import TopVentas from '../components/TopVentas';
import BannerWebAmigas from '../components/BannerWebAmigas';

// Estilos necesarios
import '../styles/default.css';
import '../styles/styles.css';

export default function Home() {
    return (
        <>
            <Header />
            <div className='home-bookflix fondo-blanco'>
                <BannerUnete />
                <Generos />
                <BannerEnvio />
                <Carrusel />
                <TopVentas />
                <BannerWebAmigas />
            </div>
            <Footer />
        </>
    );
}