using PhotoChallenge.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IServices
{
    public interface IContactService
    {
        Task<ContactResponseDto> SendEmailAsync(ContactDto emailRequest);
        Task<ContactResponseDto> SendResetPasswordEmailAsync(string email, string resetLink);
        Task<ContactResponseDto> SendEmailToUserByIdAsync(int userId, string subject, string message);
    }
}
