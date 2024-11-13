using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories;


public interface ICarritoRepository
{
    Task<Carrito> GetCarritoByUserIdAsync(int userId);
    Task AñadirItemAsync(int userId, int libroId, int cantidad);
    Task ActualizarCantidadProductoAsync(int userId, int libroId, int nuevaCantidad);
    Task BorrarItemAsync(int userId, int libroId);
    Task ClearCarritoAsync(int userId);
    Task<int> GetCarritoTotalAsync(int userId);
}
