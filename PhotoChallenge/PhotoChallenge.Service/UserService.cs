using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Core.Models;
using PhotoChallenge.Data;
using PhotoChallenge.Data.Repositories;
using SendGrid.Helpers.Mail;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PhotoChallenge.Service
{
    public class UserService : IUserService
    {
        private readonly IManagerRepository _managerRepository;

        public UserService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<List<User>> GetUsersAsync() => await _managerRepository.Users.GetUsersAsync();
        public async Task<User> GetUserByIdAsync(int id) =>
            await _managerRepository.Users.GetUserByIdAsync(id);
        public async Task<User> GetUserByEmailAsync(string email) =>
            await _managerRepository.Users.GetUserByEmailAsync(email);
        public async Task<User> RegisterUserAsync(User user)
        {
            var newUser = await _managerRepository.Users.RegisterUserAsync(user);
            await _managerRepository.SaveAsync();
            return newUser;
        }

        public async Task<User> LoginUserAsync(string email, string password) =>
            await _managerRepository.Users.LoginUserAsync(email, password);


        public async Task<User> UpdateUserAsync(int id, User user)
        {
            var updatedUser = await _managerRepository.Users.UpdateUserAsync(id, user);
            await _managerRepository.SaveAsync();
            return updatedUser;
        }


        public async Task<User> RemoveUserAsync(int id)
        {
            var removedUser = await _managerRepository.Users.RemoveUserAsync(id);
            await _managerRepository.SaveAsync(); 
            return removedUser;
        }
    }
}
