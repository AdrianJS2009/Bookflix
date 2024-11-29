using Bookflix_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public interface IReseñasRepository
    {
        
        Task<Reseña> ObtenerPorUsuarioYProductoAsync(int usuarioId, int productoId);

        
        Task AgregarAsync(Reseña reseña);

       
        Task<bool> ExisteReseñaAsync(int usuarioId, int productoId);

        
        Task<IEnumerable<Reseña>> ObtenerPorUsuarioAsync(int usuarioId);

       
        Task<IEnumerable<Reseña>> ObtenerPorProductoAsync(int productoId);

       
        Task<double> CalcularPromedioEstrellasAsync(int productoId);

        
        Task<int> ContarReseñasPorProductoAsync(int productoId);

       
        Task<IEnumerable<Reseña>> ObtenerPorCategoriaAsync(int productoId, string categoria);

    }
}
