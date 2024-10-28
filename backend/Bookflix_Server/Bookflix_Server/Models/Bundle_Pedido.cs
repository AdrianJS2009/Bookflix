﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookflix_Server.Models
{
    public class Bundle_Pedido //Creo los atributos de los paquetes de los pedidos según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdBundlePedido { get; set; }

        [Required]  //Defino los campos de bundle y pedido
        public Bundles Bundle { get; set; }
    }
}