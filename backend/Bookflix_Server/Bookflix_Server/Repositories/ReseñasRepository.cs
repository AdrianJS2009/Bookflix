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

        // Método para obtener una reseña por su ID de usuario y producto
        public Task<Reseña> GetByUsuarioIdAndProductoIdAsync(int usuarioId, int productoId)
        {
            var reseña = listaReseñas.FirstOrDefault(r => r.UsuarioId == usuarioId && r.ProductoId == productoId);
            return Task.FromResult(reseña);
        }

        // Método para agregar una nueva reseña
        public Task AddAsync(Reseña reseña)
        {
            listaReseñas.Add(reseña);
            return Task.CompletedTask;
        }

        // Método para verificar si una reseña existe por su ID de usuario y producto
        public Task<bool> ReseñaExistsAsync(int usuarioId, int productoId)
        {
            var exists = listaReseñas.Any(r => r.UsuarioId == usuarioId && r.ProductoId == productoId);
            return Task.FromResult(exists);
        }

        // Método para obtener todas las reseñas de un usuario
        public Task<IEnumerable<Reseña>> GetByUsuarioIdAsync(int usuarioId)
        {
            var reseñas = listaReseñas.Where(r => r.UsuarioId == usuarioId);
            return Task.FromResult<IEnumerable<Reseña>>(reseñas);
        }

        // Método para obtener todas las reseñas de un producto
        public Task<IEnumerable<Reseña>> GetByProductoIdAsync(int productoId)
        {
            var reseñas = listaReseñas.Where(r => r.ProductoId == productoId);
            return Task.FromResult<IEnumerable<Reseña>>(reseñas);
        }

        // Método para calcular el promedio de estrellas de todas las reseñas
        public Task<double> CalcularPromedioEstrellasAsync()
        {
            if (listaReseñas.Count == 0)
                return Task.FromResult(0.0);

            var promedio = listaReseñas.Average(r => r.Estrellas);
            return Task.FromResult(promedio);
        }
    }
}
