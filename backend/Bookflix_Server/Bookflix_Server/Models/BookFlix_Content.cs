using Microsoft.EntityFrameworkCore;

public class BookFLix_Content : DbContext
{
    public DbSet<User> Users { get; set; }

    // Define una propiedad para la entidad User
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Sobreescribo el método OnModelCreating para definir una restricción de unicidad en el campo Email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}