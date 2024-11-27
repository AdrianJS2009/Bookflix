namespace Bookflix_Server.Models
{
    public class ReseñaDTO
    {
        public string Texto { get; set; }
        public int Estrellas { get; set; }
        public string Categoria { get; set; }
        public string LibroId { get; set; }
        public DateTime FechaPublicacion { get; set; } 
        public string Autor { get; set; } 
    }
}
