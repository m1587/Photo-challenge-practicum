using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoChallenge.API.Models;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Core.Models;

namespace PhotoChallenge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChallengeController : ControllerBase
    {
        private readonly IChallengeService _challengeService;
        private readonly IMapper _mapper;

        public ChallengeController(IChallengeService challengeService, IMapper mapper)
        {
            _challengeService = challengeService;
            _mapper = mapper;
        }

        [HttpGet("last-winner")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetLastFinishedChallengeAsync()
        {
            var challenge = await _challengeService.GetLastFinishedChallengeAsync();
            if (challenge == null)
                return NotFound(new { Message = "לא נמצאה תמונה מנצחת." });

            return Ok(_mapper.Map<ChallengeResponseDTO>(challenge));
        }

        [HttpGet("active-challenge")]
        public async Task<IActionResult> GetLastActiveChallengeAsync()
        {
            var challenge = await _challengeService.GetLastActiveChallengeAsync();
            if (challenge == null)
                return NotFound(new { Message = "לא נמצא אתגר פעיל." });

            return Ok(_mapper.Map<ChallengeResponseDTO>(challenge));
        }

        [HttpGet("check-uploaded")]
        [Authorize]
        public async Task<IActionResult> CheckIfUserUploaded([FromQuery] int userId, [FromQuery] int challengeId)
        {
            var hasUploaded = await _challengeService.CheckIfUserUploadedAsync(userId, challengeId);
            return Ok(new { hasUploaded });
        }

        [HttpGet("previous-challenges")]
        public async Task<IActionResult> GetAllFinishedChallengesAsync()
        {
            var challenges = await _challengeService.GetAllFinishedChallengesAsync();
            return Ok(_mapper.Map<IEnumerable<ChallengeResponseDTO>>(challenges));
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> AddChallengeAsync([FromBody] ChallengePostModel challengeDto)
        {
            if (challengeDto == null || string.IsNullOrEmpty(challengeDto.Title) || string.IsNullOrEmpty(challengeDto.Description))
                return BadRequest(new { Message = "Invalid challenge data" });

            var newChallenge = new Challenge
            {
                Title = challengeDto.Title,
                Description = challengeDto.Description,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(7)
            };
            Console.WriteLine(challengeDto.Description + " "+ challengeDto.Title);
            var addedChallenge = await _challengeService.AddChallengeAsync(newChallenge);
            return Ok(_mapper.Map<ChallengeResponseDTO>(addedChallenge));
        }
        [HttpGet("{challengeId}/winner-image")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetWinningImage(int challengeId)
        {
            var winningImage = await _challengeService.GetWinningImageByChallengeIdAsync(challengeId);
            if (winningImage == null)
                return NotFound(new { Message = "No winning image found for this challenge" });

            return Ok(_mapper.Map<ImageResponseDTO>(winningImage));
        }
        [HttpPost("{challengeId}/calculate-winner")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateWinnerImage(int challengeId)
        {
            var updatedChallenge = await _challengeService.UpdateWinnerImageAsync(challengeId);
            if (updatedChallenge == null)
                return NotFound(new { Message = "Challenge not found or no images." });

            return Ok(new { Message = "Winner updated successfully", challenge = updatedChallenge });
        }
        [HttpGet("monthly-photo-report")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetMonthlyUploadCountsAsync()
        {
            var report = await _challengeService.GetMonthlyUploadCountsAsync();
            return Ok(report);
        }

        [HttpGet("monthly-registration-report")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetMonthlyRegistrationReportAsync()
        {
            var report = await _challengeService.GetMonthlyRegistrationReportAsync();
            return Ok(report);
        }
    }
}
