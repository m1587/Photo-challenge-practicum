using HuggingFace;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Service;
using System.Net.Http.Headers;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PhotoChallenge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HuggingFaceController : ControllerBase
    {
        private readonly IHuggingFaceService _huggingFaceService;

        public HuggingFaceController(IHuggingFaceService huggingFaceService, ILogger<HuggingFaceController> logger)
        {
            _huggingFaceService = huggingFaceService;
        }

        [HttpPost("generate-image")]
        public async Task<IActionResult> GenerateImage([FromBody] string prompt)
        {
            try
            {
                var imageBytes = await _huggingFaceService.GenerateImageAsync(prompt);
                return File(imageBytes, "image/png");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"HuggingFace error: {ex.Message}");
            }
        }
        [HttpPost("generate-description")]
        public async Task<IActionResult> GenerateDescription([FromBody] HuggingFaceRequest request)
        {
            try
            {
                var description = await _huggingFaceService.GenerateTextAsync(request.GeneratedText);
                return Ok(description);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"HuggingFace error: {ex.Message}");
            }
        }



    }
}
