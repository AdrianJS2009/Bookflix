using Bookflix_Server.Models;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public interface ICarritoRepository
    {
        Task<Carrito> ObtenerCarritoPorUsuarioIdAsync(int idUsuario);

        Task<Carrito> ObtenerOCrearCarritoPorUsuarioIdAsync(int idUsuario);

        Task AgregarProductoAlCarritoAsync(Carrito carrito, int idProducto, int cantidad);

        Task<bool> EliminarProductoDelCarritoAsync(Carrito carrito, int idProducto);

        Task VaciarCarritoAsync(Carrito carrito);

        Task GuardarCambiosAsync();

        Task<bool> UsuarioHaCompradoProductoAsync(int idUsuario, int idProducto);

        Task ComprarCarritoAsync(Carrito carrito);

        Task<bool> ActualizarCantidadProductoAsync(Carrito carrito, int idProducto, int nuevaCantidad);

    }
}
