using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IRepositories
{
    public interface IUserRepository
    {

        public  Task<List<User>> GetUsersAsync();
        public Task<User?> GetUserByEmailAsync(string email);
        public  Task<User> GetUserByIdAsync(int id);
        public Task<User> RegisterUserAsync(User user);
        public Task<User> LoginUserAsync(string email, string password);
        public Task<User> UpdateUserAsync(int id, User user);
        public Task<User> RemoveUserAsync(int id);
    }
}
