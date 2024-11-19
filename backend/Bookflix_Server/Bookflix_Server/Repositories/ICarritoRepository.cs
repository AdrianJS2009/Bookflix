using Bookflix_Server.Models;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public interface ICarritoRepository
    {
        // Obtiene el carrito de un usuario por su ID
        Task<Carrito> ObtenerCarritoPorUsuarioIdAsync(int idUsuario);

        // Obtiene o crea un carrito para un usuario
        Task<Carrito> ObtenerOCrearCarritoPorUsuarioIdAsync(int idUsuario);

        // Agrega un producto al carrito
        Task AgregarProductoAlCarritoAsync(Carrito carrito, int idProducto, int cantidad);

        // Elimina un producto del carrito
        Task<bool> EliminarProductoDelCarritoAsync(Carrito carrito, int idProducto);

        // Vacía el carrito
        Task VaciarCarritoAsync(Carrito carrito);

        // Guarda los cambios en el contexto
        Task GuardarCambiosAsync();

        // Verifica si un usuario ha comprado un producto
        Task<bool> UsuarioHaCompradoProductoAsync(int idUsuario, int idProducto);
    }
}
