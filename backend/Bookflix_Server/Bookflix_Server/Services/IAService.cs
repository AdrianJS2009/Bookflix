using Bookflix_Server.Models.IA;


namespace Bookflix_Server.Services
{
    public class IAService
    {
        private readonly PredictionEnginePool<ModelInput, ModelOutput> _model;

        public IAService(PredictionEnginePool<ModelInput, ModelOutput> model)
        {
            _model = model;
        }

        public ModelOutput Predict(string text)
        {
            // Procesamiento del texto si es necesario
            var input = new ModelInput { Text = text };
            var output = _model.Predict(input);

            // Opcional: Agregar el texto original al output para referencia
            output.Text = text;
            return output;
        }
    }
}
}
