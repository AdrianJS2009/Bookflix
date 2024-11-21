import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { auth } = useAuth();
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("carrito");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    if (!auth.token) {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items, auth.token]);

  const agregarAlCarrito = async (producto) => {
    if (auth.token) {
      try {
        const payload = {
          LibroId: producto.libroId, // Asegúrate de que coincide con el modelo del backend
          Cantidad: producto.cantidad, // Utiliza la cantidad proporcionada
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

        // Actualiza el carrito localmente
        setItems((prevItems) => [...prevItems, producto]);
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
        // Manejo del error
      }
    } else {
      // Si no hay token, guarda en localStorage
      setItems((prevItems) => [...prevItems, producto]);
    }
  };

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  return useContext(CarritoContext);
};
