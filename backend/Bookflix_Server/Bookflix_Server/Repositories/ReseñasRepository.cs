using Bookflix_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public Task<double> CalcularPromedioEstrellasAsync(int productoId)
        {
            var reseñasProducto = _listaReseñas.Where(r => r.ProductoId == productoId);
            if (!reseñasProducto.Any())
                return Task.FromResult(0.0);

            var promedio = reseñasProducto.Average(r => r.Estrellas);
            return Task.FromResult(promedio);
        }

        public Task<int> ContarReseñasPorProductoAsync(int productoId)
        {
            var count = _listaReseñas.Count(r => r.ProductoId == productoId);
            return Task.FromResult(count);
        }

        public Task<IEnumerable<Reseña>> GetReseñasByCategoriaAsync(int productoId, string categoria)
        {
            var reseñas = _listaReseñas.Where(r => r.ProductoId == productoId && r.Categoria.Equals(categoria, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(reseñas.AsEnumerable());
        }
    }
}
