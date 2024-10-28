import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/default.css';
import '../styles/styles.css';

export default function Registro() {
    return (
        <>
            <Header />
            <div className='registro-container'>
                <h1>Registro</h1>
                <form className='registro-form'>
                    <div>
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" required />
                    </div>
                    <div>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" required />
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" required />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input type="password" id="confirmPassword" required />
                    </div>
                    <button type="submit">Registrarse</button>
                </form>
                <Link to="/login">¿Aún no tienes cuenta? Regístrate</Link>
            </div>
            <Footer />
        </>
    );
}
