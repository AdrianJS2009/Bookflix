using Bookflix_Server.Models;


namespace Bookflix_Server.Repositories
{
    public interface IReseñasRepository
    {
       
        Task<Reseña> GetByUsuarioIdAndProductoIdAsync(int usuarioId, int productoId);

     
        Task AddAsync(Reseña reseña);

      
        Task<bool> ReseñaExistsAsync(int usuarioId, int productoId);

       
        Task<IEnumerable<Reseña>> GetByUsuarioIdAsync(int usuarioId);

       
        Task<IEnumerable<Reseña>> GetByProductoIdAsync(int productoId);

       
        Task<double> CalcularPromedioEstrellasAsync(int productoId);

      
        Task<int> ContarReseñasPorProductoAsync(int productoId);

        
        Task<IEnumerable<Reseña>> GetReseñasByCategoriaAsync(int productoId, string categoria);
    }
}
