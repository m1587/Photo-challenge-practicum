using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IServices
{
    public interface IAuthService
    {
        string GenerateJwtToken(string username, string[] roles);
    }
}
