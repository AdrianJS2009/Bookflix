import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Carrito = ({ isAuthenticated }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null); // Almacena el userId

    
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('authToken'); // Suponiendo que el token está en localStorage
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decodifica el JWT
                return decodedToken.userId; // O la clave que corresponda a tu userId en el payload
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                return null;
            }
        }
        return null;
    };

    // Función para cargar el carrito, ya sea desde el backend o localStorage
    const loadCart = async () => {
        if (isAuthenticated) {
            try {
                getUserIdFromToken();
                const response = await fetch(`/api/Carrito/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCartItems(data.items || []);
                } else {
                    console.error("Error al cargar el carrito del servidor:", response.statusText);
                }
            } catch (error) {
                console.error("Error al cargar el carrito del servidor:", error);
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(localCart);
        }
    };

    // Función para agregar un artículo al carrito
    const addItemToCart = async (libroId, cantidad) => {
        if (isAuthenticated) {
            try {
                const response = await fetch(`/api/Carrito/${userId}/agregar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ libroId, cantidad }),
                });
                if (response.ok) {
                    loadCart();
                } else {
                    console.error("Error al agregar el artículo al carrito:", response.statusText);
                }
            } catch (error) {
                console.error("Error al agregar el artículo al carrito:", error);
            }
        } else {
            const updatedCart = [...cartItems, { libroId, cantidad }];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        }
    };

    // Función para eliminar un artículo del carrito
    const removeItemFromCart = async (libroId) => {
        if (isAuthenticated) {
            try {
                const response = await fetch(`/api/Carrito/${userId}/eliminar/${libroId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    loadCart();
                } else {
                    console.error("Error al eliminar el artículo del carrito:", response.statusText);
                }
            } catch (error) {
                console.error("Error al eliminar el artículo del carrito:", error);
            }
        } else {
            const updatedCart = cartItems.filter(item => item.libroId !== libroId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        }
    };

    // Función para limpiar el carrito
    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                const response = await fetch(`/api/Carrito/${userId}/limpiar`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    loadCart();
                } else {
                    console.error("Error al limpiar el carrito:", response.statusText);
                }
            } catch (error) {
                console.error("Error al limpiar el carrito:", error);
            }
        } else {
            localStorage.removeItem('cart');
            setCartItems([]);
        }
    };

    useEffect(() => {
        loadCart();
    }, [isAuthenticated, userId]);

    return (
        <div>
            <h2>Carrito</h2>
            <ul>
                {cartItems.map((item, index) => (
                    <li key={index}>
                        Libro ID: {item.libroId}, Cantidad: {item.cantidad}
                        <button onClick={() => removeItemFromCart(item.libroId)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <button onClick={clearCart}>Limpiar Carrito</button>
        </div>
    );
};

export default Carrito;
