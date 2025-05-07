using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoChallenge.API.Models;
using PhotoChallenge.Core;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Core.Models;
using PhotoChallenge.Service;

namespace PhotoChallenge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IAuthService authService, IMapper mapper)
        {
            _userService = userService;
            _authService = authService;
            _mapper = mapper;
        }
        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetUsersAsync()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(_mapper.Map<IEnumerable<UserResponseDTO>>(users));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetUserByIdAsync(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(_mapper.Map<UserResponseDTO>(user));
        }
        [HttpGet("email/{email}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetUserByEmailAsync(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(_mapper.Map<UserResponseDTO>(user));
        }


        [HttpPost]
        public async Task<IActionResult> RegisterUserAsync([FromBody] UserPostModel userDto)
        {
            var userToAdd = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password
            };
            var createdUser = await _userService.RegisterUserAsync(userToAdd);

            return Ok(_mapper.Map<UserResponseDTO>(createdUser));
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginUserAsync([FromBody] UserLoginPostModel loginRequest)
        {
            var user = await _userService.LoginUserAsync(loginRequest.Email, loginRequest.Password);
            if (user == null)
                return Unauthorized(new { Message = "Invalid email or password" });

            var token = _authService.GenerateJwtToken(user.Name, user.Role != null ? new[] { user.Role.ToString() } : Array.Empty<string>());

            return Ok(new
            {
                Message = "Login successful",
                Token = token,
                User = _mapper.Map<UserResponseDTO>(user)
            });
        }
        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateUserAsync(int id, [FromBody] UserPostModel userDto)
        {
            var userToUpdate = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password
            };

            var updatedUser = await _userService.UpdateUserAsync(id, userToUpdate);
            if (updatedUser == null)
                return NotFound(new { Message = "User not found" });

            return Ok(new { Message = "User updated successfully", User = _mapper.Map<UserResponseDTO>(updatedUser) });
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> RemoveUserAsync(int id)
        {
            var deletedUser = await _userService.RemoveUserAsync(id);
            Console.WriteLine("delete?");
            if (deletedUser == null)
                return NotFound(new { Message = "User not found" });

            return Ok(new { Message = "User deleted successfully", User = _mapper.Map<UserResponseDTO>(deletedUser) });
        }
    }
}
