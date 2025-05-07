using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class ContactResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public ContactResponseDto()
        {
        }

        public ContactResponseDto(bool success, string message)
        {
            Success = success;
            Message = message;
        }
    }
}
