namespace Bookflix_Server.Models.DTOs
{
    public class ReseñaDTO
    {
        public string Autor { get; set; }
        public string Texto { get; set; }
        public int Estrellas { get; set; }
        public string Categoria { get; set; }
        public DateTime FechaPublicacion { get; set; }
        public string IdLibro { get; set; }
    }

}
