import { createContext, useContext, useEffect, useState } from "react";
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
          const response = await fetch(
            "https://localhost:7182/api/Carrito/ListarCarrito",
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          if (!response.ok)
            throw new Error("No se pudo sincronizar con el servidor.");

          const data = await response.json();
          const carritoItems = Array.isArray(data?.items)
            ? data.items.map((item) => ({
                libroId: item.libroId,
                nombre: item.nombreLibro || "Sin nombre",
                cantidad: item.cantidad || 1,
                precio: item.precio || 0,
                urlImagen: item.urlImagen || "placeholder.jpg",
              }))
            : [];
          setItems(carritoItems);
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
        }
      };
      sincronizarCarrito();
    } else {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [auth.token]);

  const validarStock = async (producto, cantidad) => {
    try {
      const response = await fetch(
        "https://localhost:7182/api/Libro/VerificarStock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify([producto.idLibro]),
        }
      );

      if (!response.ok) {
        throw new Error("Error al verificar el stock del producto.");
      }

      const stockInfo = await response.json();
      const productoStock = stockInfo.find((p) => p.id === producto.idLibro);
      if (!productoStock) {
        alert(`El producto "${producto.nombre}" no está disponible.`);
        return false;
      }

      if (!productoStock.disponible || productoStock.stock < cantidad) {
        alert(
          `El producto "${producto.nombre}" no tiene suficiente stock disponible.`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error al verificar el stock:", error);
      return false;
    }
  };

  const agregarAlCarrito = async (producto, cantidad) => {
    if (!producto || !cantidad) {
      console.error("Producto o cantidad no definidos en agregarAlCarrito.", {
        producto,
        cantidad,
      });
      return;
    }

    const esValido = await validarStock(producto, cantidad);
    if (!esValido) return;

    const productoConDatosCompletos = {
      libroId: producto.idLibro,
      cantidad,
      nombre: producto.nombre,
      precio: producto.precio,
      urlImagen: producto.urlImagen,
      subtotal: producto.precio * cantidad,
    };

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.libroId === productoConDatosCompletos.libroId
      );
      let newItems;

      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.libroId === productoConDatosCompletos.libroId
            ? {
                ...item,
                cantidad: item.cantidad + productoConDatosCompletos.cantidad,
              }
            : item
        );
      } else {
        newItems = [...prevItems, productoConDatosCompletos];
      }

      localStorage.setItem("carrito", JSON.stringify(newItems));
      return newItems;
    });

    alert(
      `${productoConDatosCompletos.cantidad} unidad(es) de "${productoConDatosCompletos.nombre}" añadida(s) al carrito.`
    );
  };

  const actualizarCantidad = async (libroId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    try {
      const response = await fetch(
        "https://localhost:7182/api/Carrito/ActualizarCantidad",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            LibroId: libroId,
            NuevaCantidad: nuevaCantidad,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error desconocido al actualizar la cantidad."
        );
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.libroId === libroId ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
    }
  };

  const validarStockCarrito = async () => {
    try {
      const idsProductos = items.map((item) => item.libroId);
      const response = await fetch(
        "https://localhost:7182/api/Libro/VerificarStock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(idsProductos),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error al verificar el stock de los productos del carrito."
        );
      }

      const stockInfo = await response.json();
      const sinStock = stockInfo.filter(
        (producto) =>
          !producto.Disponible ||
          items.find((item) => item.libroId === producto.Id)?.cantidad >
            producto.Stock
      );

      if (sinStock.length > 0) {
        alert(
          `Los siguientes productos no tienen suficiente stock: ${sinStock
            .map((p) => p.Id)
            .join(", ")}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al validar el stock del carrito:", error);
      return false;
    }
  };

  const eliminarItem = async (productoId) => {
    if (!productoId) {
      console.error("ID de producto no definido al intentar eliminar.");
      return;
    }

    try {
      if (auth.token) {
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
          const errorData = await response.json();
          throw new Error(
            errorData.error || "No se pudo eliminar el producto del servidor."
          );
        }
      }

      setItems((prevItems) => {
        const newItems = prevItems.filter(
          (item) => item.libroId !== productoId
        );
        localStorage.setItem("carrito", JSON.stringify(newItems));
        return newItems;
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
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
    <CarritoContext.Provider
      value={{
        items,
        agregarAlCarrito,
        eliminarItem,
        vaciarCarrito,
        validarStockCarrito,
        actualizarCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
