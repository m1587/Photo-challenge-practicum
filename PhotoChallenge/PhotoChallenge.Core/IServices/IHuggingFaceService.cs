using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PhotoChallenge.Core.DTOs;

namespace PhotoChallenge.Core.IServices
{
    public interface IHuggingFaceService
    {
        public Task<byte[]> GenerateImageAsync(string prompt);
        public Task<string> GenerateTextAsync(string topic);

    }
}
