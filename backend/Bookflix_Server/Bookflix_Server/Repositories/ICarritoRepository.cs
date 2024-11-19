using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    public interface ICarritoRepository
    {

        Task<Carrito> ObtenerCarritoPorIdUsuarioAsync(int idUsuario);


        Task<Carrito> ObtenerOCrearCarritoPorIdUsuarioAsync(int idUsuario);


        Task AgregarProductoAlCarritoAsync(Carrito carrito, int idProducto, int cantidad);


        Task<bool> EliminarProductoDelCarritoAsync(Carrito carrito, int idProducto);


        Task VaciarCarritoAsync(Carrito carrito);


        Task GuardarCambiosAsync();


        Task<bool> UsuarioHaCompradoProductoAsync(int idUsuario, int idProducto);
    }
}
