using Microsoft.EntityFrameworkCore;
using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Data.Repositories
{
    public class ChallengeRepository : Repository<Challenge>, IChallengeRepository
    {
        private readonly DataContext _context;
        public ChallengeRepository(DataContext context) : base(context) { _context = context; }

        // שליפת האתגר האחרון שהסתיים
        public async Task<Challenge?> GetLastFinishedChallengeAsync() =>
            await _dbSet
                .Include(c => c.WinnerImg)
                .Include(c => c.WinnerUser)
                .Where(c => c.EndDate < DateTime.Now)
                .OrderByDescending(c => c.EndDate)
                .FirstOrDefaultAsync();

        public async Task<Challenge?> GetLastActiveChallengeAsync() =>
            await _dbSet
                .Include(c => c.WinnerImg)
                .Include(c => c.WinnerUser)
                .Where(c => c.EndDate >= DateTime.Now && c.WinnerImg == null)
                .OrderBy(c => c.EndDate)
                .FirstOrDefaultAsync();

        public async Task<List<Challenge>> GetAllFinishedChallengesAsync() =>
            await _dbSet
                 .Include(c => c.WinnerImg)
                 .Include(c => c.WinnerUser)
                .Where(c => c.EndDate < DateTime.Now)
                .OrderByDescending(c => c.EndDate)
                .ToListAsync();

        public async Task<Challenge> AddChallengeAsync(Challenge newChallenge)
        {
            Console.WriteLine(newChallenge.Id);
            await _dbSet.AddAsync(newChallenge);
            return newChallenge;
        }

        public async Task<bool> CheckIfUserUploadedAsync(int userId, int challengeId)
        {
            return await _context.Images
                .AnyAsync(i => i.UserId == userId && i.ChallengeId == challengeId);
        }
        public async Task<Image?> GetWinningImageByChallengeIdAsync(int challengeId)
        {
            return await _context.Images
                .Where(i => i.ChallengeId == challengeId)
                .OrderByDescending(i => i.Votes.Count)
                .FirstOrDefaultAsync();
        }
        public async Task<Challenge?> UpdateWinnerImageAsync(int challengeId)
        {
            var challenge = await _context.Challenges
                .Include(c => c.Images)
                    .ThenInclude(i => i.Votes)
                .FirstOrDefaultAsync(c => c.Id == challengeId);

            if (challenge == null || challenge.Images.Count == 0)
                return null;

            var winnerImage = challenge.Images
                .OrderByDescending(i => i.Votes.Count)
                .FirstOrDefault();

            if (winnerImage != null)
            {
                challenge.WinnerImgId = winnerImage.Id;
                challenge.WinnerUserId = winnerImage.UserId;
                challenge.EndDate = DateTime.Now;
                await _context.SaveChangesAsync();
            }

            return challenge;
        }
        public async Task<Dictionary<string, int>> GetMonthlyUploadCountsAsync()
        {
            var challenges = await _dbSet
                .Include(c => c.Images)
                .ToListAsync();

            var monthlyCounts = challenges
                .SelectMany(c => c.Images)
                //.GroupBy(img => img.UploadedAt.ToString("yyyy-MM"))
                .GroupBy(img => img.UploadedAt.ToLocalTime().ToString("yyyy-MM"))
                .ToDictionary(g => g.Key, g => g.Count());

            return monthlyCounts;
        }

        public async Task<Dictionary<string, int>> GetMonthlyRegistrationReportAsync()
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .ToListAsync(); // טוען את הנתונים לזיכרון
            foreach (var user in users)
            {
                Console.WriteLine($"UserId: {user.Id}, CreatedAt: {user.CreatedAt}, Kind: {user.CreatedAt.Kind}, GroupKey: {user.CreatedAt.ToString("yyyy-MM")}");
            }

            var monthlyReport = users
                //.GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                .GroupBy(u => u.CreatedAt.ToLocalTime().ToString("yyyy-MM"))
                .ToDictionary(
                   g => g.Key,
                   g => g.Count()
                );
            Console.WriteLine(users.Where(u => u.Id == 28).FirstOrDefault().CreatedAt);
            return monthlyReport;
        }
    }
}
