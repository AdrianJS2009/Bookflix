using Bookflix_Server.Models;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public interface ICarritoRepository
    {
        Task<Carrito> GetCarritoByUserIdAsync(int userId);
        Task<Carrito> GetOrCreateCarritoByUserIdAsync(int userId);
        Task AgregarItemAlCarritoAsync(Carrito carrito, int libroId, int cantidad);
        Task<bool> EliminarItemDelCarritoAsync(Carrito carrito, int libroId);
        Task LimpiarCarritoAsync(Carrito carrito);
        Task SaveChangesAsync();

        Task<bool> HasUserPurchasedProductAsync(int userId, int productoId);
    }
}
