using Bookflix_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public interface ICompraRepository
    {
        Task RegistrarCompraAsync(Compra compra);
        Task<IEnumerable<Compra>> ObtenerComprasPorUsuarioIdAsync(int usuarioId);
        Task GuardarCambiosAsync();
    }
}