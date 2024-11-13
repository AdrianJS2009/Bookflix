using F23.StringSimilarity;
using F23.StringSimilarity.Interfaces;
using Bookflix_Server.Repositories;
using System.Text;
using System.Globalization;

namespace Bookflix_Server.Services;

public class SmartSearchService
{
    private const double THRESHOLD = 0.75;
    private readonly IProductoRepository _productoRepository;
    private readonly INormalizedStringSimilarity _stringSimilarityComparer;

    private List<string> TituloLibros { get; set; } = new List<string>();

    public SmartSearchService(IProductoRepository productoRepository)
    {
        _stringSimilarityComparer = new JaroWinkler();
        _productoRepository = productoRepository ?? throw new ArgumentNullException(nameof(productoRepository));
    }

    // Método asincrónico para inicializar la lista de títulos
    public async Task InitializeLibrosAsync()
    {
        TituloLibros = await _productoRepository.GetAllNombres();
    }

    public IEnumerable<string> Search(string query)
    {
        IEnumerable<string> result;

        // Si la consulta está vacía o solo tiene espacios en blanco, devolvemos todos los items
        if (string.IsNullOrWhiteSpace(query))
        {
            result = TituloLibros;
        }
        else
        {
            // Limpiamos la query y la separamos por espacios
            string[] queryKeys = GetKeys(ClearText(query));
            List<string> matches = new List<string>();

            foreach (string item in TituloLibros)
            {
                string[] itemKeys = GetKeys(ClearText(item));

                // Si coincide alguna de las palabras de item con las de query
                if (IsMatch(queryKeys, itemKeys))
                {
                    matches.Add(item);
                }
            }

            result = matches;
        }

        return result;
    }

    private bool IsMatch(string[] queryKeys, string[] itemKeys)
    {
        bool isMatch = false;

        for (int i = 0; !isMatch && i < itemKeys.Length; i++)
        {
            string itemKey = itemKeys[i];

            for (int j = 0; !isMatch && j < queryKeys.Length; j++)
            {
                string queryKey = queryKeys[j];
                isMatch = IsMatch(itemKey, queryKey);
            }
        }

        return isMatch;
    }

    private bool IsMatch(string itemKey, string queryKey)
    {
        return itemKey == queryKey
            || itemKey.Contains(queryKey)
            || _stringSimilarityComparer.Similarity(itemKey, queryKey) >= THRESHOLD;
    }

    private string[] GetKeys(string query)
    {
        return query.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    private string ClearText(string text)
    {
        return RemoveDiacritics(text.ToLower());
    }

    private string RemoveDiacritics(string text)
    {
        string normalizedString = text.Normalize(NormalizationForm.FormD);
        StringBuilder stringBuilder = new StringBuilder(normalizedString.Length);

        for (int i = 0; i < normalizedString.Length; i++)
        {
            char c = normalizedString[i];
            UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}
