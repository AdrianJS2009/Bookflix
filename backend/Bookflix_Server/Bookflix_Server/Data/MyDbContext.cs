using Microsoft.EntityFrameworkCore;
using Bookflix_Server.Models;

namespace Bookflix_Server.Data
{
    public class MyDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Utiliza una ruta relativa o absoluta para bookflix.db
                optionsBuilder.UseSqlite("DataSource=bookflix.db");
            }
        }
    }
}
