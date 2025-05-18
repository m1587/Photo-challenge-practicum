using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class HuggingFaceTextResponse
    {
        [JsonProperty("generated_text")]
        public string GeneratedText { get; set; }
    }
}
