using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class ImageDescription
    {
        public IFormFile Image { get; set; }
        public string Topic { get; set; }
    }
}
