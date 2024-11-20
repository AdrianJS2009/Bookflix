using F23.StringSimilarity;
using F23.StringSimilarity.Interfaces;
using Bookflix_Server.Repositories;
using System.Text;
using System.Globalization;

namespace Bookflix_Server.Services
{
    public class ServicioBusquedaInteligente
    {
        private const double UMBRAL_SIMILITUD = 0.75;
        private readonly IProductoRepository _repositorioProductos;
        private readonly INormalizedStringSimilarity _comparadorSimilitud;

        private List<string> TitulosLibros { get; set; } = new List<string>();

        public ServicioBusquedaInteligente(IProductoRepository repositorioProductos)
        {
            _comparadorSimilitud = new JaroWinkler();
            _repositorioProductos = repositorioProductos ?? throw new ArgumentNullException(nameof(repositorioProductos));
        }

        // Inicializa la lista de títulos de libros desde el repositorio
        public async Task InicializarLibrosAsync()
        {
            TitulosLibros = await _repositorioProductos.ObtenerTodosLosNombres();
        }

        // Realiza una búsqueda de títulos que coincidan con la consulta proporcionada
        public IEnumerable<string> Buscar(string consulta)
        {
            // Verificamos si la lista está inicializada
            if (TitulosLibros == null || !TitulosLibros.Any())
                throw new InvalidOperationException("La lista de títulos no ha sido inicializada.");

            IEnumerable<string> resultado;

            if (string.IsNullOrWhiteSpace(consulta))
            {
                resultado = TitulosLibros;
            }
            else
            {
                string[] palabrasConsulta = ObtenerPalabras(LimpiarTexto(consulta));
                List<string> coincidencias = new List<string>();

                foreach (string titulo in TitulosLibros)
                {
                    string[] palabrasTitulo = ObtenerPalabras(LimpiarTexto(titulo));

                    if (TieneCoincidencia(palabrasConsulta, palabrasTitulo))
                    {
                        coincidencias.Add(titulo);
                    }
                }

                resultado = coincidencias;
            }

            return resultado;
        }

        // Verifica si alguna palabra de la consulta coincide con las del título
        private bool TieneCoincidencia(string[] palabrasConsulta, string[] palabrasTitulo)
        {
            foreach (string palabraTitulo in palabrasTitulo)
            {
                foreach (string palabraConsulta in palabrasConsulta)
                {
                    if (EsCoincidencia(palabraTitulo, palabraConsulta))
                        return true;
                }
            }

            return false;
        }

        // Determina si dos palabras coinciden exacta o parcialmente
        private bool EsCoincidencia(string palabraTitulo, string palabraConsulta)
        {
            return palabraTitulo == palabraConsulta
                || palabraTitulo.Contains(palabraConsulta)
                || _comparadorSimilitud.Similarity(palabraTitulo, palabraConsulta) >= UMBRAL_SIMILITUD;
        }

        // Divide un texto en palabras eliminando espacios adicionales
        private string[] ObtenerPalabras(string texto)
        {
            return texto.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        }

        // Limpia el texto eliminando diacríticos y convirtiéndolo a minúsculas
        private string LimpiarTexto(string texto)
        {
            return EliminarDiacriticos(texto.ToLower());
        }

        // Elimina los diacríticos de un texto (por ejemplo, acentos)
        private string EliminarDiacriticos(string texto)
        {
            string textoNormalizado = texto.Normalize(NormalizationForm.FormD);
            StringBuilder resultado = new StringBuilder();

            foreach (char c in textoNormalizado)
            {
                UnicodeCategory categoria = CharUnicodeInfo.GetUnicodeCategory(c);
                if (categoria != UnicodeCategory.NonSpacingMark)
                {
                    resultado.Append(c);
                }
            }

            return resultado.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
