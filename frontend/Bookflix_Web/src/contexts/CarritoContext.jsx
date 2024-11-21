import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { auth } = useAuth(); // Acceder al estado de autenticación
  const [items, setItems] = useState([]);

  useEffect(() => {
    const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];
    setItems(carritoLocal);
  }, []);

  useEffect(() => {
    if (!auth.token) {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items, auth.token]);

  const agregarAlCarrito = async (producto) => {
    if (auth.token) {
      try {
        const payload = {
          LibroId: producto.id, // Asegúrate de que coincide con el modelo del backend
          Cantidad: 1, // Cantidad fija para cumplir con el modelo esperado
        };

        console.log("Payload being sent:", payload); // Depuración: Muestra los datos enviados

        const response = await fetch(
          "https://localhost:7182/api/Carrito/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        console.log("Response status:", response.status); // Depuración: Muestra el estado de la respuesta
        console.log("Response headers:", response.headers); // Depuración: Muestra los encabezados de la respuesta

        if (!response.ok) {
          throw new Error("No se pudo sincronizar con el servidor.");
        }

        const updatedItems = await response.json();
        console.log("Updated items received:", updatedItems); // Depuración: Muestra los datos recibidos del backend
        setItems(updatedItems);
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error); // Depuración: Muestra cualquier error en la sincronización
      }
    } else {
      setItems((prevItems) => [...prevItems, producto]);
    }
  };

  const vaciarCarrito = async () => {
    if (auth.token) {
      try {
        const response = await fetch(
          "https://localhost:7182/api/Carrito/vaciar",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo vaciar el carrito en el servidor.");
        }
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
      }
    }

    setItems([]);
    if (!auth.token) {
      localStorage.removeItem("carrito");
    }
  };

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  return useContext(CarritoContext);
};
