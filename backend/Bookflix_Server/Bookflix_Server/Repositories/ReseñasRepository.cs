using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    // Implementación de la interfaz IReseñasRepository
    public class ReseñasRepository : IReseñasRepository
    {
        // Lista privada que almacena las reseñas
        private readonly List<Reseña> listaReseñas = new List<Reseña>();

        // Método para obtener una reseña por su ID
        public Task<Reseña> GetByIdAsync(int id)
        {
            // Busca la reseña en la lista por su ID
            var reseña = listaReseñas.FirstOrDefault(r => r.Id == id);
            // Retorna la reseña encontrada (o null si no se encuentra)
            return Task.FromResult(reseña);
        }

        // Método para agregar una nueva reseña
        public Task AddAsync(Reseña reseña)
        {
            // Agrega la reseña a la lista
            listaReseñas.Add(reseña);
            // Retorna una tarea completada
            return Task.CompletedTask;
        }

        // Método para verificar si una reseña existe por su ID
        public Task<bool> ReseñaExistsAsync(int id)
        {
            // Verifica si alguna reseña en la lista tiene el ID especificado
            var exists = listaReseñas.Any(r => r.Id == id);
            // Retorna el resultado de la verificación
            return Task.FromResult(exists);
        }

        // Método para obtener todas las reseñas
        public Task<IEnumerable<Reseña>> GetAllAsync()
        {
            // Retorna todas las reseñas en la lista
            return Task.FromResult<IEnumerable<Reseña>>(listaReseñas);
        }

        // Método para calcular el promedio de estrellas de todas las reseñas
        public Task<double> CalcularPromedioEstrellasAsync()
        {
            // Si no hay reseñas, el promedio es 0
            if (listaReseñas.Count == 0)
                return Task.FromResult(0.0);

            // Calcula el promedio de estrellas
            var promedio = listaReseñas.Average(r => r.Estrellas);
            // Retorna el promedio calculado
            return Task.FromResult(promedio);
        }
    }
}
