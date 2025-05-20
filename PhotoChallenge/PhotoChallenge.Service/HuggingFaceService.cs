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
        private readonly string _apiKeyOpenrouter;
        private const string API_URL = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32";

        public HuggingFaceService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = Environment.GetEnvironmentVariable("HUGGING_FACE_APIKEY");
            _apiKeyOpenrouter = Environment.GetEnvironmentVariable("OPEN_ROUTER_API");
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
        public async Task<string> GenerateTextAsync(string topic)
        {
            var payload = new
            {
                model = "openai/gpt-3.5-turbo", // אפשר לשנות למודל אחר
                messages = new[]
                {
            new { role = "user", content = $"Write a poetic and vivid 5-line description about: {topic}" }
        }
            };

            var json = JsonConvert.SerializeObject(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKeyOpenrouter);
            _httpClient.DefaultRequestHeaders.Add("X-Title", "my-dotnet-app");

            var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            dynamic result = JsonConvert.DeserializeObject(responseString);
            string generated = result?.choices?[0]?.message?.content;

            return generated ?? "No description generated.";
        }

    }

}


