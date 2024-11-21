import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const agregarAlCarrito = (producto) => {
    setItems((prevItems) => [...prevItems, producto]);
  };

  const vaciarCarrito = () => setItems([]);

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
