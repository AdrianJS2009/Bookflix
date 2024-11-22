namespace Bookflix_Server.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IProductoRepository Productos { get; }

        IUserRepository Users { get; }

        IReseñasRepository Reseñas { get; }

        Task<int> SaveChangesAsync();
    }
}
