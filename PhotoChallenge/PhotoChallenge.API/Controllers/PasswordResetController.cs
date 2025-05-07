using Microsoft.AspNetCore.Mvc;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PhotoChallenge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordResetController : ControllerBase
    {
        private readonly IPasswordResetService _resetService;
        private readonly IUserService _userService;
        private readonly IContactService _contactService;

        public PasswordResetController(IPasswordResetService resetService, IUserService userService, IContactService contactService)
        {
            _resetService = resetService;
            _userService = userService;
            _contactService = contactService;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestResetPassword([FromBody] string email)
        {
            var token = await _resetService.GenerateResetToken(email);
            var resetLink = $"http://localhost:5173/reset-password?token={token}";
            var result = await _contactService.SendResetPasswordEmailAsync(email, resetLink);
            return Ok(result);
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            var email = await _resetService.GetEmailByTokenAsync(dto.Token);
            if (email == null)
                return BadRequest("Invalid or expired token.");
            var user = await _userService.GetUserByEmailAsync(email);  // יש לאמת אם המשתמש קיים או לא
            if (user == null)
                return BadRequest("User not found.");
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _userService.UpdateUserAsync(user.Id, user);
            await _resetService.RemoveTokenAsync(dto.Token);

            return Ok("Password has been reset successfully.");
        }

    }
}
