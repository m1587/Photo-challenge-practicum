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
    public class VoteController : Controller
    {
        private readonly IVoteService _voteService;

        public VoteController(IVoteService voteService)
        {
            _voteService = voteService;
        }

        [HttpGet("count/{imageId}")]
        [Authorize]
        public async Task<IActionResult> GetVotesCountAsync(int imageId)
        {
            try
            {
                int count = await _voteService.GetVotesCountAsync(imageId);
                return Ok(new { ImageId = imageId, VoteCount = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching vote count.", Error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddVoteAsync([FromBody] VotePostModel voteDto)
        {
            if (voteDto == null || voteDto.UserId <= 0 || voteDto.ImageId <= 0)
                return BadRequest(new { Message = "Invalid vote data." });

            try
            {
                var vote = new Vote
                {
                    UserId = voteDto.UserId,
                    ImageId = voteDto.ImageId,
                    CreatedAt = DateTime.UtcNow
                };

                await _voteService.AddVoteAsync(vote);
                return Ok(new { Message = "Vote added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while adding vote.", Error = ex.Message });
            }
        }
    }
}
