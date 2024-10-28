import { Link } from 'react-router-dom';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/default.css';
import '../styles/styles.css';
import '../styles/login.css';

export default function Login() {
    return (
        <>
            <Header />
            <div className='login-container'>
                <div className='login-form'>
                    <h1>Iniciar Sesión</h1>
                    <form>
                        <div>
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" required />
                        </div>
                        <div>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" required />
                        </div>
                        <button type="submit">Entrar</button>
                    </form>
                    <Link to="/registro">¿Aún no tienes cuenta? Regístrate</Link>
                </div>
            </div>
            <Footer />
        </>
    );
}
