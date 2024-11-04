using System.Collections.Generic;
using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    public interface IReseñasRepository
    {
        Task<Reseña> GetByIdAsync(int id);
        Task AddAsync(Reseña reseña);
        Task<bool> ReseñaExistsAsync(int id);
        Task<IEnumerable<Reseña>> GetAllAsync();
        Task<double> CalcularPromedioEstrellasAsync();
    }
}


