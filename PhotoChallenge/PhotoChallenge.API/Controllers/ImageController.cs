using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoChallenge.API.Models;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Core.Models;

namespace PhotoChallenge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;

        private readonly IMapper _mapper;

        public ImageController(IImageService imageService, IMapper mapper)
        {
            _imageService = imageService;
            _mapper = mapper;
        }

        [HttpGet("name")]
        [Authorize]
        public async Task<IActionResult> GetImageByNameAsync([FromQuery] string imageName)
        {
            var image = await _imageService.GetImageByNameAsync(imageName);
            if (image == null)
                return NotFound(new { Message = "Image not found" });

            return Ok(_mapper.Map<ImageResponseDTO>(image));
        }

        [HttpGet("challenge/{challengeId}")]
        [Authorize]
        public async Task<IActionResult> GetImagesByChallengeIdAsync(int challengeId)
        {
            var images = await _imageService.GetImagesByChallengeIdAsync(challengeId);
            if (images == null || images.Count == 0)
                return NotFound(new { Message = "No images found for this challenge" });

            return Ok(_mapper.Map<IEnumerable<ImageResponseDTO>>(images));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetImageByIdAsync(int id)
        {
            var image = await _imageService.GetImageByIdAsync(id);
            if (image == null)
                return NotFound(new { Message = "Image not found" });

            return Ok(_mapper.Map<ImageResponseDTO>(image));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddImageAsync([FromBody] ImagePostModel imageDto)
        {
            if (imageDto == null || string.IsNullOrEmpty(imageDto.ImageURL))
                return BadRequest(new { Message = "Invalid image data" });

            var newImage = new Image
            {
                UserId = imageDto.UserId,
                ChallengeId = imageDto.ChallengeId,
                ImageURL = imageDto.ImageURL,
                Caption = imageDto.Caption,
                UploadedAt = DateTime.UtcNow
            };

            var createdImage = await _imageService.AddImageAsync(newImage);
            return Ok(new { Message = "Image added successfully", Image = _mapper.Map<ImageResponseDTO>(createdImage) });

        }

    }
}
