using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoChallenge.API.Models;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IServices;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net.Mail;
using System.Net;
using Newtonsoft.Json.Linq;
using Mailjet.Client;
using Mailjet.Client.Resources;

namespace PhotoChallenge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost("send-email")]
        public async Task<ContactResponseDto> SendEmailAsync(ContactDto emailRequest)
        {
            if (emailRequest == null)
            {
                return new ContactResponseDto { Success = false, Message = "Invalid request" };
            }

            // קריאה לשירות לשלוח את המייל
            return await _contactService.SendEmailAsync(emailRequest);
        }

        [HttpPost("send-email-to-user/{userId}")]
        public async Task<IActionResult> SendEmailToUserById(int userId, [FromBody] ContactDto emailRequest)
        {
            var result = await _contactService.SendEmailToUserByIdAsync(userId, emailRequest.Subject, emailRequest.Message);
            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

    }
}

