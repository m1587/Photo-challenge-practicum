using Microsoft.Extensions.Configuration;
using PhotoChallenge.Core.IServices;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using PhotoChallenge.Core.DTOs;
using System.Net.Http;
using Newtonsoft.Json;

namespace PhotoChallenge.Service
{
    public class HuggingFaceService : IHuggingFaceService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private const string API_URL = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32";

        public HuggingFaceService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = Environment.GetEnvironmentVariable("HUGGING_FACE_APIKEY"); 
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<byte[]> GenerateImageAsync(string prompt)
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"),
                Headers =
        {
            { "Authorization", $"Bearer {_apiKey}" }
        },
                Content = new StringContent($"{{ \"inputs\": \"{prompt}\" }}", Encoding.UTF8, "application/json")
            };

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"HuggingFace error: {error}");
            }

            return await response.Content.ReadAsByteArrayAsync();  // מחזיר את התמונה כ- byte[]
        }

    }

}


