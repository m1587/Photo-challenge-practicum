using Microsoft.Extensions.Configuration;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IServices;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Service
{
    public class ContactService : IContactService
    {
        private readonly ISendGridClient _sendGridClient;
        private readonly string _sendGridApiKey;
        private readonly IUserService _userService;
        public ContactService(IUserService userService)
        {
            _sendGridApiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            _sendGridClient = new SendGridClient(_sendGridApiKey);
            _userService = userService;
        }

        public async Task<ContactResponseDto> SendEmailAsync(ContactDto emailRequest)
        {
            if (emailRequest == null)
            {
                return new ContactResponseDto { Success = false, Message = "Invalid request" };
            }

            // כאן אתה שולח מכתובת מאומתת ב-SendGrid
            var from = new EmailAddress("nechami3142@gmail.com");
            var to = new EmailAddress("m0556721587@gmail.com"); // כתובת הנמען

            // צור את המייל
            var msg = MailHelper.CreateSingleEmail(from, to, emailRequest.Subject, emailRequest.Message, $"<p>{emailRequest.Message}</p>");

            // הגדר את ה-Reply-To לכתובת המשתמש
            msg.ReplyTo = new EmailAddress("nechami3142@gmail.com");

            // שלח את המייל
            var response = await _sendGridClient.SendEmailAsync(msg);
            var responseBody = await response.Body.ReadAsStringAsync();

            return new ContactResponseDto
            {
                Success = response.IsSuccessStatusCode,
                Message = response.IsSuccessStatusCode ? "Email sent successfully." : $"Failed to send email: {responseBody}"
            };
        }

        public async Task<ContactResponseDto> SendResetPasswordEmailAsync(string email, string resetLink)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(resetLink))
            {
                return new ContactResponseDto { Success = false, Message = "Invalid email or link" };
            }

            var from = new EmailAddress("nechami3142@gmail.com");
            var to = new EmailAddress(email);
            var subject = "איפוס סיסמה לאתר Photo Challenge";
            var plainTextContent = $"לחצי כאן כדי לאפס את הסיסמה: {resetLink}";
            var htmlContent = $"<p><strong><a href='{resetLink}'>לחצי כאן כדי לאפס סיסמה</a></strong></p>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            msg.ReplyTo = new EmailAddress("nechami3142@gmail.com");

            var response = await _sendGridClient.SendEmailAsync(msg);
            var responseBody = await response.Body.ReadAsStringAsync();

            return new ContactResponseDto
            {
                Success = response.IsSuccessStatusCode,
                Message = response.IsSuccessStatusCode ? "Email sent successfully." : $"Failed to send email: {responseBody}"
            };
        }

        public async Task<ContactResponseDto> SendEmailToUserByIdAsync(int userId, string subject, string message)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null || string.IsNullOrWhiteSpace(user.Email))
            {
                return new ContactResponseDto { Success = false, Message = "User not found or email is missing." };
            }

            var from = new EmailAddress("nechami3142@gmail.com");
            var to = new EmailAddress(user.Email);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, message, $"<p>{message}</p>");
            msg.ReplyTo = new EmailAddress("nechami3142@gmail.com");

            var response = await _sendGridClient.SendEmailAsync(msg);
            var responseBody = await response.Body.ReadAsStringAsync();

            return new ContactResponseDto
            {
                Success = response.IsSuccessStatusCode,
                Message = response.IsSuccessStatusCode ? "Email sent successfully." : $"Failed to send email: {responseBody}"
            };
        }
    }
}
