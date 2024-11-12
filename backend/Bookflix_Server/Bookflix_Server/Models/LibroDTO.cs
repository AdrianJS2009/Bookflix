namespace Bookflix_Server.Models
{
    public class LibroDTO
    {
        public int IdLibro { get; set; }
        public string Nombre { get; set; }
        public int Precio { get; set; }
        public string UrlImagen { get; set; }
        public string Genero { get; set; }
        public string Descripcion { get; set; }
    }
}
