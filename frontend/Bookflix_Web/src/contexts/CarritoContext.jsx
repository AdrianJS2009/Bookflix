import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const CarritoContext = createContext();

export const useCarrito = () => {
  return useContext(CarritoContext);
};

export const CarritoProvider = ({ children }) => {
  const { auth } = useAuth();
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("carrito");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    if (auth.token) {
      const sincronizarCarrito = async () => {
        try {
          const response = await fetch("https://localhost:7182/api/Carrito", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          if (!response.ok) {
            throw new Error("No se pudo sincronizar con el servidor.");
          }
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
        }
      };
      sincronizarCarrito();
    } else {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items, auth.token]);

  const agregarAlCarrito = async (producto) => {
    if (auth.token) {
      try {
        const payload = {
          LibroId: producto.libroId, 
          Cantidad: producto.cantidad, 
        };

        console.log("Payload being sent:", payload); 

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

        console.log("Response status:", response.status); 
        console.log("Response headers:", response.headers); 

        if (!response.ok) {
          throw new Error("No se pudo sincronizar con el servidor.");
        }

        setItems((prevItems) => [...prevItems, producto]);
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
      }
    } else {
      setItems((prevItems) => {
        const newItems = [...prevItems, producto];
        localStorage.setItem("carrito", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const eliminarItem = async (productoId) => {
    if (auth.token) {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Carrito/eliminar/${productoId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo eliminar el producto del servidor.");
        }

        setItems((prevItems) => {
          const newItems = prevItems.filter(item => item.libroId !== productoId);
          localStorage.setItem("carrito", JSON.stringify(newItems));
          return newItems;
        });
      } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
      }
    } else {
      setItems((prevItems) => {
        const newItems = prevItems.filter(item => item.libroId !== productoId);
        localStorage.setItem("carrito", JSON.stringify(newItems));
        return newItems;
      });
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
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo vaciar el carrito en el servidor.");
        }

        setItems([]);
        localStorage.removeItem("carrito");
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
      }
    } else {
      setItems([]);
      localStorage.removeItem("carrito");
    }
  };

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito, eliminarItem, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};