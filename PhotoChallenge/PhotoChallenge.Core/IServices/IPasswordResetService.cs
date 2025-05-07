using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IServices
{
    public interface IPasswordResetService
    {
        Task<string> GenerateResetToken(string email);
        Task<string?> GetEmailByTokenAsync(string token);
        Task RemoveTokenAsync(string token);
    }
}
