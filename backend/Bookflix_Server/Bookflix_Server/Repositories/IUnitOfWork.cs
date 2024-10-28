namespace Bookflix_Server.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; } // Acceso al repo de users
        Task<int> CompleteAsync();
    }
}
