
namespace Bookflix_Server.Services
{
    public class ReviewInput
    {
        public string Text { get; set; }
        public string Label { get; set; }
    }

    public class ReviewPrediction
    {
        public string PredictedLabel { get; set; }
    }
}