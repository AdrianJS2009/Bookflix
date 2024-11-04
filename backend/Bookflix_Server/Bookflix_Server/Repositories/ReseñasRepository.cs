using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    public class ReseñasRepository : IReseñasRepository
    {
        private readonly List<Reseña> listaReseñas = new List<Reseña>();

        public Task<Reseña> GetByIdAsync(int id)
        {
            var reseña = listaReseñas.FirstOrDefault(r => r.Id == id);
            return Task.FromResult(reseña);
        }

        public Task AddAsync(Reseña reseña)
        {
            listaReseñas.Add(reseña);
            return Task.CompletedTask;
        }

        public Task<bool> ReseñaExistsAsync(int id)
        {
            var exists = listaReseñas.Any(r => r.Id == id);
            return Task.FromResult(exists);
        }

        public Task<IEnumerable<Reseña>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Reseña>>(listaReseñas);
        }

        public Task<double> CalcularPromedioEstrellasAsync()
        {
            if (listaReseñas.Count == 0)
                return Task.FromResult(0.0);

            var promedio = listaReseñas.Average(r => r.Estrellas);
            return Task.FromResult(promedio);
        }
    }
}


