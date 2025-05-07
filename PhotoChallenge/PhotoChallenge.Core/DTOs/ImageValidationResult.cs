using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class ImageValidationResult
    {
        public bool IsMatch { get; set; }
        public double Similarity { get; set; }
        public string? Error { get; set; }
    }
}
