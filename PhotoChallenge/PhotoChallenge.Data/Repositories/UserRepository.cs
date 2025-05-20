using Microsoft.EntityFrameworkCore;
using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.Models;

namespace PhotoChallenge.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _dataContext;
        public UserRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<User>> GetUsersAsync() =>
          await _dataContext.Users
         .Where(u => !u.IsDeleted)
         .AsNoTracking()
         .ToListAsync();

        public async Task<User> GetUserByIdAsync(int id) =>
            await _dataContext.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
        public async Task<User?> GetUserByEmailAsync(string email) =>
             await _dataContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        public async Task<User> RegisterUserAsync(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password); // הצפנת הסיסמה
            user.Role = ERole.User;
            await _dataContext.Users.AddAsync(user);
            return user;
        }


        public async Task<User?> LoginUserAsync(string email, string password)
        {
            var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null; // במקום להחזיר אובייקט לא נכון, עדיף להחזיר null
            }
            return user;
        }



        public async Task<User> UpdateUserAsync(int id, User user)
        {


            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null)
                return null;

            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.Role = user.Role;
            existingUser.IsDeleted = user.IsDeleted;
            _dataContext.Users.Update(existingUser);
            Console.WriteLine(existingUser.IsDeleted);
            return existingUser;
        }


        public async Task<User?> RemoveUserAsync(int id)
        {
            var userToDelete = await GetUserByIdAsync(id);
            if (userToDelete == null)
                return null;

            userToDelete.IsDeleted = true;
            await UpdateUserAsync(userToDelete.Id, userToDelete);
            return userToDelete;
        }

    }
}
