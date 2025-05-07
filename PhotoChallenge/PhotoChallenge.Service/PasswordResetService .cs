using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.IServices;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Service
{
    public class PasswordResetService : IPasswordResetService
    {
        private static readonly ConcurrentDictionary<string, (string email, DateTime expiration)> _tokens = new();

        public async Task<string> GenerateResetToken(string email)
        {
            var token = Guid.NewGuid().ToString();
            _tokens[token] = (email, DateTime.UtcNow.AddHours(1));
            return token;
        }

        public async Task<string?> GetEmailByTokenAsync(string token)
        {
            if (_tokens.TryGetValue(token, out var data) && data.expiration > DateTime.UtcNow)
            {
                return data.email;
            }
            return null;
        }

        public async Task RemoveTokenAsync(string token)
        {
            _tokens.TryRemove(token, out _);
        }

    }
}
