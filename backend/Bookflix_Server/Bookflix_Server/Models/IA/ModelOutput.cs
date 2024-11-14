using Microsoft.ML.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookflix_Server.Models.IA
{
    public class ModelOutput
    {
        [ColumnName("text")]
        public string Text { get; set; }

        [ColumnName("label")]
        public uint Label { get; set; }

        [ColumnName("PredictedLabel")]
        public float PredictedLabel { get; set; }

        [ColumnName("Score")]
        public float[] Score { get; set; }
    }
}
