using System.Collections.Generic;
using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    // Interfaz que define los métodos para manejar las reseñas
    public interface IReseñasRepository
    {
        // Método para obtener una reseña por su ID
        Task<Reseña> GetByIdAsync(int id);

        // Método para agregar una nueva reseña
        Task AddAsync(Reseña reseña);

        // Método para verificar si una reseña existe por su ID
        Task<bool> ReseñaExistsAsync(int id);

        // Método para obtener todas las reseñas
        Task<IEnumerable<Reseña>> GetAllAsync();

        // Método para calcular el promedio de estrellas de todas las reseñas
        Task<double> CalcularPromedioEstrellasAsync();
    }
}
