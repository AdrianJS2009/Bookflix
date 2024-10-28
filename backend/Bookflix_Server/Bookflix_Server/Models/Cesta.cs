using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models
{
    public class Cesta //Creo los atributos de la cesta según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdCesta { get; set; }

        [Required]  //Defino los campos de usuario y productos
        public User Usuario { get; set; }

        [Required]
        public List<Productos> Productos { get; set; } // Defino la lista de productos

        // Constructor para inicializar la lista de productos
        public Cesta()
        {
            Productos = new List<Productos>();
        }
    }
}