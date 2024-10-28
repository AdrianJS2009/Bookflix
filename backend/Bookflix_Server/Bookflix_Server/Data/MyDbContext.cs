using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Data
{
    public class MyDbContext : DbContext
    {
        // Tabla usuarios
        public DbSet<User> Users { get; set; }

        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Verifica si el contexto ya está configurado para evitar conflictos.
            if (!optionsBuilder.IsConfigured)
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                optionsBuilder.UseSqlite($"DataSource={baseDir}bookflix.db"); // Utilizamos la ruta por defecto para la bbdd
            }
        }
    }
}
