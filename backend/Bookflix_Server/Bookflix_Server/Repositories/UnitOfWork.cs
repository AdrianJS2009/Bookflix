using Bookflix_Server.Data;

namespace Bookflix_Server.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MyDbContext _context;

        public UnitOfWork(MyDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context); // Iniciamos el repo de Users
        }

        public IUserRepository Users { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public IReseñasRepository Reseña { get; private set; }
        // Hacemos dispose del contexto de base de datos la UnitOfWork termina
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
