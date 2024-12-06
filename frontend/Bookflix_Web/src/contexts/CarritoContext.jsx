import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext";

const CarritoContext = createContext();

export const useCarrito = () => {
  return useContext(CarritoContext);
};

export const CarritoProvider = ({ children }) => {
  const { auth, isAuthenticated,setAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("carrito");
    return savedItems ? JSON.parse(savedItems) : [];
  });

const leerCarritoBackend = async () => {
  try {
    const response = await fetch(
      "https://localhost:7182/api/Carrito/ListarCarrito",
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Error al listar el carrito del servidor.");
    }

    const data = await response.json();
    const carritoItems = Array.isArray(data?.items)
      ? data.items.map((item) => ({
          idLibro: item.idLibro,
          nombre: item.nombreLibro || "Sin nombre",
          cantidad: item.cantidad || 1,
          precio: item.precio || 0,
          urlImagen: item.urlImagen || "placeholder.jpg",
        }))
      : [];
    setItems(carritoItems);
  } catch (error) {
    console.error("Error al sincronizar el carrito:", error);
    toast.error("Error al sincronizar el carrito.");
  }
};
  useEffect(() => {
    if (isAuthenticated) {
      sincronizarCarrito();
      setAuthenticated(false);

    } 
    else{
      leerCarritoBackend();
    }
  }, [isAuthenticated]);



  const sincronizarCarrito = async () => {
    try {
      const localCarrito = localStorage.getItem("carrito");
      const localItems = localCarrito ? JSON.parse(localCarrito) : [];

      if (localItems.length > 0) {
        const payload = localItems
          .filter((item) => item.idLibro && item.cantidad)
          .map((item) => ({
            IdLibro: item.idLibro,
            Cantidad: item.cantidad,
          }));

        if (payload.length === 0) {
          console.error("No hay datos válidos para sincronizar.");
          return;
        }

        const response = await fetch(
          "https://localhost:7182/api/Carrito/Sincronizar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Error al sincronizar productos locales.");
        }

        toast.success("Productos locales sincronizados con tu cuenta.");
        localStorage.removeItem("carrito");
      }

      const response = await fetch(
        "https://localhost:7182/api/Carrito/ListarCarrito",
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Error al listar el carrito del servidor.");
      }

      const data = await response.json();
      const carritoItems = Array.isArray(data?.items)
        ? data.items.map((item) => ({
            idLibro: item.idLibro,
            nombre: item.nombreLibro || "Sin nombre",
            cantidad: item.cantidad || 1,
            precio: item.precio || 0,
            urlImagen: item.urlImagen || "placeholder.jpg",
          }))
        : [];
      setItems(carritoItems);
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("Error al sincronizar el carrito.");
    }
  };

  const agregarAlCarrito = async (producto, cantidadSolicitada) => {
    if (!producto || !cantidadSolicitada) {
      console.error("Producto o cantidad no definidos en agregarAlCarrito.", {
        producto,
        cantidadSolicitada,
      });
      return;
    }
  
    if (!auth.token) {
      const existingItem = items.find((item) => item.idLibro === producto.idLibro);
  
      if (existingItem) {
        const updatedItems = items.map((item) =>
          item.idLibro === producto.idLibro
            ? { ...item, cantidad: item.cantidad + cantidadSolicitada }
            : item
        );
        setItems(updatedItems);
        localStorage.setItem("carrito", JSON.stringify(updatedItems));
        toast.success("Producto añadido al carrito local.");
      } else {
        const updatedItems = [...items, { ...producto, cantidad: cantidadSolicitada }];
        setItems(updatedItems);
        localStorage.setItem("carrito", JSON.stringify(updatedItems));
        toast.success("Producto añadido al carrito local.");
      }
      return;
    }
  
    try {
      const responseCarrito = await fetch("https://localhost:7182/api/Carrito/ListarCarrito", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
  
      if (!responseCarrito.ok) {
        throw new Error("Error al obtener el carrito.");
      }
  
      const carritoActual = await responseCarrito.json();

      const responseStock = await fetch(
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
  
      const stockData = await responseStock.json();
      const productoStock = stockData.find((item) => item.id === producto.idLibro);
  
      if (productoStock && !productoStock.disponible) {
        toast.error("Producto no disponible en stock.");
        return;
      }
  
      const cantidadMaximaBackend = productoStock ? productoStock.stock : 0;

      const existingCarritoItem = carritoActual.items.find((item) => item.idLibro === producto.idLibro);
  
      let cantidadAAgregar = cantidadSolicitada;
      if (existingCarritoItem) {
        const cantidadTotal = existingCarritoItem.cantidad + cantidadSolicitada;
  
        if (cantidadTotal > cantidadMaximaBackend) {
          cantidadAAgregar = cantidadMaximaBackend - existingCarritoItem.cantidad;
        } else {
          cantidadAAgregar = cantidadSolicitada;
        }
      } else if (cantidadSolicitada > cantidadMaximaBackend) {
        cantidadAAgregar = cantidadMaximaBackend;
      }

      if (cantidadAAgregar > 0) {
        const nuevoItem = {
          idLibro: producto.idLibro,
          cantidad: cantidadAAgregar,
        };
  
        const responseAgregar = await fetch("https://localhost:7182/api/Carrito/agregar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(nuevoItem),
        });
  
        if (!responseAgregar.ok) {
          throw new Error("Error al agregar el producto al carrito.");
        }
  
        toast.success("Producto añadido al carrito.");
        leerCarritoBackend();
      } else {
        toast.error("No hay suficiente stock disponible.");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      toast.error("Error al agregar producto al carrito.");
      leerCarritoBackend();
    }
  };
  

  const eliminarItem = async (productoId) => {

    if (!productoId) {
      console.error("ID de producto no definido al intentar eliminar.");
      return;
    }

    if (!auth.token) {
      const updatedItems = items.filter((item) => item.idLibro !== productoId);
      setItems(updatedItems);
      localStorage.setItem("carrito", JSON.stringify(updatedItems));
      toast.success("Producto eliminado del carrito local.");
      return;
    }

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
        throw new Error(
          "Error al eliminar el producto del carrito en el servidor."
        );
      }

      setItems(
        (prevItems) => prevItems.filter((item) => item.idLibro !== productoId)
      );
      toast.success("Producto eliminado del carrito.");
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      toast.error("Error al eliminar el producto del carrito.");
    }
  };

  const vaciarCarritoLocal = async () => {
      setItems([]);
      localStorage.removeItem("carrito");
      toast.success("Carrito local vaciado.");
      return;
  };

  const vaciarCarrito = async () => {
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
      toast.success("Carrito vaciado.");
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      toast.error("Error al vaciar el carrito.");
    }
  };

  const validarStockCarrito = async () => {
    try {
      const idsProductos = items.map((item) => item.idLibro);
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
          items.find((item) => item.idLibro === producto.Id)?.cantidad >
          producto.Stock
      );

      if (sinStock.length > 0) {
        toast.error(
          `Los siguientes productos no tienen suficiente stock: ${sinStock
            .map((p) => p.Id)
            .join(", ")}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al validar el stock del carrito:", error);
      toast.error("Error al validar el stock del carrito.");
      return false;
    }
  };

  const actualizarCantidad = async (idLibro, nuevaCantidad) => {

    if (nuevaCantidad < 1) return;

    if (!auth.token) {
      const updatedItems = items.map((item) =>
        item.idLibro === idLibro
          ? { ...item, cantidad: nuevaCantidad }
          : item
      );
      setItems(updatedItems);
      localStorage.setItem("carrito", JSON.stringify(updatedItems));
      return;
    }

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
            IdLibro: idLibro,
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
          item.idLibro === idLibro
            ? { ...item, cantidad: nuevaCantidad }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      toast.error("Error al actualizar la cantidad.");
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarAlCarrito,
        eliminarItem,
        vaciarCarrito,
        vaciarCarritoLocal,
        validarStockCarrito,
        actualizarCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
