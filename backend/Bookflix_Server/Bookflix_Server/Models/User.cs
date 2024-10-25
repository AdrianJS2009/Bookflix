using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookflix_Server.Models;

public class User //Creo los atributos del usuario según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
{
    [Key]   //Defino la clave primaria
    public int IdUser { get; set; } 

    [Required]  //Defino los campos de nombre, apellidos, email, dirección y rol
    public string Nombre { get; set; }

    [Required]
    public string Apellidos { get; set; }   

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Direccion { get; set; }

    [Required]
    [DefaultValue("usuario")]   //Defino el campo Rol con un valor por defecto de "usuario"
    public string Rol { get; set; } = "usuario";
}
public class BookflixContext : DbContext    //Creo la clase BookflixContext que hereda de DbContext para poder interactuar con la BBDD
{
    public DbSet<User> Users { get; set; }  //Define una propiedad par la entidad User

    protected override void OnModelCreating(ModelBuilder modelBuilder)  //Sobreescribo el método OnModelCreating para definir una restricción de unicidad en el campo Email
    {
        modelBuilder.Entity<User>() //Defino la entidad User
            .HasIndex(u => u.Email) //Defino un índice en el campo Email
            .IsUnique();    //Defino que el índice sea único

        base.OnModelCreating(modelBuilder); //Llamo al método base
    }
}
public class Pedidos //Creo los atributos de los pedidos según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
{
    [Key]   //Defino la clave primaria
    public int IdPedido { get; set; }

    [Required]  //Defino los campos de fecha, precio, estado y usuario
    public DateTime Fecha { get; set; }

    [Required]
    public double Precio { get; set; }

    [Required]
    public User Usuario { get; set; }
}

