using System.Collections.Generic;
using System.Linq;

namespace Bookflix_Server.Models
{
    public class CarritoTemporal
    {
        public List<CarritoItem> Items { get; set; } = new List<CarritoItem>();

        public int Total => Items?.Sum(item => item.Subtotal) ?? 0;
    }
}