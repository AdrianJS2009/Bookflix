using Bookflix_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public interface ICompraRepository
    {
        Task RegistrarCompraAsync(Compras compra);
        Task<IEnumerable<Compras>> ObtenerComprasPorUsuarioIdAsync(int usuarioId);
        Task GuardarCambiosAsync();
    }
}