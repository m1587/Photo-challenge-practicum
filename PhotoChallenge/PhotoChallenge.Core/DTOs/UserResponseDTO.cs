using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class UserResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ERole role { get; set; }
        public UserResponseDTO() { }
        public UserResponseDTO(User user)
        {
            Id = user.Id;
            Name = user.Name;
            Email = user.Email;
            role = user.Role;
        }
    }
}
