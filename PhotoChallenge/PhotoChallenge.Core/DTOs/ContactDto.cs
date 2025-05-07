using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class ContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }

        public ContactDto() { }

        public ContactDto(string name, string email, string subject, string message)
        {
            Name = name;
            Email = email;
            Subject = subject;
            Message = message;
        }
    }
}
