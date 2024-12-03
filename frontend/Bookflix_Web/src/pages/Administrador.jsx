import React, { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Administrador() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isShowingUsers, setIsShowingUsers] = useState(true); // Toggle between Users and Products
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await fetch("/api/user/listar");
        const productsResponse = await fetch("/api/gestion/libros");
        if (usersResponse.ok && productsResponse.ok) {
          setUsuarios(await usersResponse.json());
          setProductos(await productsResponse.json());
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar este ${
      isShowingUsers ? "usuario" : "producto"
    }?`;
    if (window.confirm(confirmMessage)) {
      const endpoint = isShowingUsers
        ? `/api/gestion/usuarios/${id}`
        : `/api/gestion/libros/${id}`;
      try {
        const response = await fetch(endpoint, { method: "DELETE" });
        if (response.ok) {
          if (isShowingUsers) {
            setUsuarios((prev) => prev.filter((user) => user.id !== id));
          } else {
            setProductos((prev) => prev.filter((product) => product.id !== id));
          }
        } else {
          console.error("Error deleting item");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleCreateOrEdit = async (item) => {
    const endpoint = item.id
      ? isShowingUsers
        ? `/api/gestion/usuarios/${item.id}`
        : `/api/gestion/libros/${item.id}`
      : isShowingUsers
      ? "/api/gestion/usuarios"
      : "/api/gestion/libros";
    const method = item.id ? "PUT" : "POST";
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        const updatedItem = await response.json();
        if (isShowingUsers) {
          setUsuarios((prev) => {
            if (item.id) {
              return prev.map((u) => (u.id === item.id ? updatedItem : u));
            } else {
              return [...prev, updatedItem];
            }
          });
        } else {
          setProductos((prev) => {
            if (item.id) {
              return prev.map((p) => (p.id === item.id ? updatedItem : p));
            } else {
              return [...prev, updatedItem];
            }
          });
        }
        setIsModalOpen(false);
      } else {
        console.error("Error saving item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Administrador</h1>
      <div className="toggle-buttons">
        <Button onClick={() => setIsShowingUsers(true)}>Usuarios</Button>
        <Button onClick={() => setIsShowingUsers(false)}>Productos</Button>
      </div>
      <section>
        <h2>{isShowingUsers ? "Usuarios" : "Productos"}</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          {isShowingUsers ? "Nuevo Usuario" : "Nuevo Producto"}
        </Button>
        <ul>
          {isShowingUsers
            ? usuarios.map((usuario) => (
                <li key={usuario.id}>
                  {usuario.nombre} ({usuario.email}) - {usuario.rol}
                  <Button onClick={() => handleDelete(usuario.id)}>
                    Eliminar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUser(usuario);
                      setIsModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                </li>
              ))
            : productos.map((producto) => (
                <li key={producto.id}>
                  <img
                    src={producto.urlImagen}
                    alt={producto.nombre}
                    width="50"
                  />
                  {producto.nombre} ({producto.precio}€) - Stock:{" "}
                  {producto.stock}
                  <Button onClick={() => handleDelete(producto.id)}>
                    Eliminar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedProduct(producto);
                      setIsModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                </li>
              ))}
        </ul>
      </section>
      {isModalOpen && (
        <div className="modal">
          <h2>
            {isShowingUsers
              ? selectedUser
                ? "Editar Usuario"
                : "Crear Usuario"
              : selectedProduct
              ? "Editar Producto"
              : "Crear Producto"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateOrEdit(
                isShowingUsers ? selectedUser : selectedProduct
              );
            }}
          >
            {isShowingUsers ? (
              <>
                <input
                  type="text"
                  value={selectedUser?.nombre || ""}
                  placeholder="Nombre"
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, nombre: e.target.value })
                  }
                />
                <input
                  type="email"
                  value={selectedUser?.email || ""}
                  placeholder="Email"
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={selectedUser?.rol || ""}
                  placeholder="Rol"
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, rol: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={selectedProduct?.nombre || ""}
                  placeholder="Nombre"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      nombre: e.target.value,
                    })
                  }
                />
                <textarea
                  value={selectedProduct?.descripcion || ""}
                  placeholder="Descripción"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      descripcion: e.target.value,
                    })
                  }
                ></textarea>
                <input
                  type="number"
                  value={selectedProduct?.precio || ""}
                  placeholder="Precio"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      precio: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  value={selectedProduct?.stock || ""}
                  placeholder="Stock"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      stock: e.target.value,
                    })
                  }
                />
              </>
            )}
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
