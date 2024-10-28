using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookflix_Server.Models
{
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
}
