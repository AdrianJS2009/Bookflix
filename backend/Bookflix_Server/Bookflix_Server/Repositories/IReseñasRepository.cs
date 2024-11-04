using System.Collections.Generic;
using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    // Interfaz que define los métodos para manejar las reseñas
    public interface IReseñasRepository
    {
        // Método para obtener una reseña por su ID de usuario y producto
        Task<Reseña> GetByUsuarioIdAndProductoIdAsync(int usuarioId, int productoId);

        // Método para agregar una nueva reseña
        Task AddAsync(Reseña reseña);

        // Método para verificar si una reseña existe por su ID de usuario y producto
        Task<bool> ReseñaExistsAsync(int usuarioId, int productoId);

        // Método para obtener todas las reseñas de un usuario
        Task<IEnumerable<Reseña>> GetByUsuarioIdAsync(int usuarioId);

        // Método para obtener todas las reseñas de un producto
        Task<IEnumerable<Reseña>> GetByProductoIdAsync(int productoId);

        // Método para calcular el promedio de estrellas de todas las reseñas
        Task<double> CalcularPromedioEstrellasAsync();
    }
}
