﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models;

public class Carrito
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int IdUser { get; set; }

    public ICollection<CarritoItem> Items { get; set; } = new List<CarritoItem>();

    [NotMapped]
    public int Total => Items.Sum(item => item.Subtotal);
}

