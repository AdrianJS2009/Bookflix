import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import "../styles/default.css";

export default function Administrador() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isShowingUsers, setIsShowingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = async (page) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const endpoint = isShowingUsers
        ? `https://localhost:7182/api/user/listar?pagina=${page + 1
        }&tamanoPagina=${itemsPerPage}`
        : `https://localhost:7182/api/libro/ListarLibros?ascendente=true&pagina=${page + 1
        }&tamanoPagina=${itemsPerPage}`;

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: ${isShowingUsers ? "Usuarios" : "Productos"
          }`
        );
      }

      const data = await response.json();

      if (isShowingUsers) {
        console.log("Usuarios Data:", data);
        setUsuarios(data.usuarios || []);
        setPageCount(data.totalPaginas || 0);
      } else {
        console.log("Productos Data:", data);
        setProductos(data.libros || []);
        setPageCount(data.totalPaginas || 0);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [isShowingUsers, currentPage, itemsPerPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = async (id) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar este ${isShowingUsers ? "usuario" : "producto"
      }?`;
    if (window.confirm(confirmMessage)) {
      const endpoint = isShowingUsers
        ? `/api/gestion/usuarios/${id}`
        : `/api/gestion/libros/${id}`;
      try {
        const response = await fetch(endpoint, { method: "DELETE" });
        if (response.ok) {
          if (isShowingUsers) {
            setUsuarios((prev) => prev.filter((user) => user.idUser !== id));
          } else {
            setProductos((prev) =>
              prev.filter((product) => product.idLibro !== id)
            );
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
        : `/api/gestion/libros/${item.idLibro}`
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
              return prev.map((u) => (u.idUser === item.id ? updatedItem : u));
            } else {
              return [...prev, updatedItem];
            }
          });
        } else {
          setProductos((prev) => {
            if (item.idLibro) {
              return prev.map((p) =>
                p.idLibro === item.idLibro ? updatedItem : p
              );
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
    <main className="admin-page">
      <h1>Administrador</h1>
      <div className="toggle-buttons">
        <Button
          onClick={() => setIsShowingUsers(true)}
          label="Usuarios"
          styleType="btnAñadir"
        />
        <Button
          onClick={() => setIsShowingUsers(false)}
          label="Productos"
          styleType="btnComprar"
        />
      </div>
      <section>
        <h2>{isShowingUsers ? "Usuarios" : "Productos"}</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          styleType="btnAñadir"
          label={isShowingUsers ? "Nuevo Usuario" : "Nuevo Producto"}
        />
        <ul className="listaAdmin">
          {isShowingUsers
            ? usuarios.map((usuario) => (
              <li key={usuario.idUser} className="itemListaAdmin">
                <strong>Nombre:</strong> {usuario.nombre} <strong>Correo:</strong> {usuario.email}<strong>Rol:</strong> {usuario.rol}
                <div>
                  <Button
                    onClick={() => handleDelete(usuario.idUser)}
                    label="Eliminar"
                    className="botonEliminar"
                  />
                  <Button
                    onClick={() => {
                      setSelectedUser(usuario);
                      setIsModalOpen(true);
                    }}
                    label="Editar"
                    styleType="btnComprar"
                  />
                </div>

              </li>
            ))
            : productos.map((producto) => (
              <li key={producto.idLibro}>
                <img
                  src={producto.urlImagen}
                  alt={producto.nombre}
                  width="50"
                />
                <Link to={`/producto/${producto.idLibro}`}>{Array.from(producto.nombre).length > 10
                  ? Array.from(producto.nombre).slice(0, 50).join("") + "..."
                  : producto.nombre} </Link>
                
                ({(producto.precio / 100).toFixed(2)}€) -
                Stock: {producto.stock}
                <div>
                  <Button
                    onClick={() => handleDelete(producto.idLibro)}
                    label="Eliminar"
                    className="botonEliminar"
                  />
                  <Button
                    onClick={() => {
                      setSelectedProduct(producto);
                      setIsModalOpen(true);
                    }}
                    label="Editar"
                    styleType="btnComprar"
                  />
                </div>

              </li>
            ))}
        </ul>
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage}
        />
      </section>
      {isModalOpen && (
        <div className="modalAdmin">
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
    </main>
  );
}
