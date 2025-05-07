using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class HuggingFaceMatchRequest
    {
        public string Base64Image { get; set; }
        public string Label { get; set; }
    }
}
