using Bookflix_Server.Data;

namespace Bookflix_Server.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MyDbContext _context;

        public IProductoRepository Productos { get; private set; }
        public IUserRepository Users { get; private set; }
        public IReseñasRepository Reseñas { get; private set; }

        public UnitOfWork(MyDbContext context, IProductoRepository productoRepository, IUserRepository userRepository, IReseñasRepository reseñasRepository)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            Productos = productoRepository ?? throw new ArgumentNullException(nameof(productoRepository));
            Users = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            Reseñas = reseñasRepository ?? throw new ArgumentNullException(nameof(reseñasRepository));
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
