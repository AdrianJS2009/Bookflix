using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MyDbContext _context;

        public UserRepository(MyDbContext context)
        {
            _context = context;
        }

        // Obtener un user por la ID
        public async Task<User> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        // Agregar un user nuevo a la BBDD
        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        // Control de existencia de un User mediante el email
        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
    }
}
