using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    public class ReseñasRepository : IReseñasRepository
    {
        private readonly List<Reseña> _listaReseñas = new List<Reseña>();

        public Task<Reseña> GetByUsuarioIdAndProductoIdAsync(int usuarioId, int productoId)
        {
            var reseña = _listaReseñas.FirstOrDefault(r => r.UsuarioId == usuarioId && r.ProductoId == productoId);
            return Task.FromResult(reseña);
        }

        public Task AddAsync(Reseña reseña)
        {
            _listaReseñas.Add(reseña);
            return Task.CompletedTask;
        }

        public Task<bool> ReseñaExistsAsync(int usuarioId, int productoId)
        {
            var exists = _listaReseñas.Any(r => r.UsuarioId == usuarioId && r.ProductoId == productoId);
            return Task.FromResult(exists);
        }

        public Task<IEnumerable<Reseña>> GetByUsuarioIdAsync(int usuarioId)
        {
            var reseñas = _listaReseñas.Where(r => r.UsuarioId == usuarioId);
            return Task.FromResult(reseñas.AsEnumerable());
        }

        public Task<IEnumerable<Reseña>> GetByProductoIdAsync(int productoId)
        {
            var reseñas = _listaReseñas.Where(r => r.ProductoId == productoId);
            return Task.FromResult(reseñas.AsEnumerable());
        }

        public Task<double> CalcularPromedioEstrellasAsync()
        {
            if (!_listaReseñas.Any())
                return Task.FromResult(0.0);

            var promedio = _listaReseñas.Average(r => r.Estrellas);
            return Task.FromResult(promedio);
        }
    }
}
