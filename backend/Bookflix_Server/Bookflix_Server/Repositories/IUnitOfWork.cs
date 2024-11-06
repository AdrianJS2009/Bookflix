namespace Bookflix_Server.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        // Repositorio de productos (libros)
        IProductoRepository Productos { get; }

        // Repositorio de usuarios
        IUserRepository Users { get; }

        // Repositorio de reseñas
        IReseñasRepository Reseñas { get; }

        // Guarda los cambios realizados en la unidad de trabajo
        Task<int> SaveChangesAsync();
    }
}
