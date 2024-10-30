using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(int id);
        Task AddAsync(User user);
        Task<bool> UserExistsAsync(string email);
        Task<User> GetByEmailAsync(string email);
    }
}
