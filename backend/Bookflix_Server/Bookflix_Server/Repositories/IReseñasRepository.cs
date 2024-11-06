using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    public interface IReseñasRepository
    {
        // Obtiene una reseña por ID de usuario y de producto
        Task<Reseña> GetByUsuarioIdAndProductoIdAsync(int usuarioId, int productoId);

        // Agrega una nueva reseña
        Task AddAsync(Reseña reseña);

        // Verifica si una reseña existe por ID de usuario y de producto
        Task<bool> ReseñaExistsAsync(int usuarioId, int productoId);

        // Obtiene todas las reseñas de un usuario específico
        Task<IEnumerable<Reseña>> GetByUsuarioIdAsync(int usuarioId);

        // Obtiene todas las reseñas de un producto específico
        Task<IEnumerable<Reseña>> GetByProductoIdAsync(int productoId);

        // Calcula el promedio de estrellas de todas las reseñas
        Task<double> CalcularPromedioEstrellasAsync();
    }
}
