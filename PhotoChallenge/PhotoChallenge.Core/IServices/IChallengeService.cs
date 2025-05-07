using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IServices
{
    public interface IChallengeService
    {
        public Task<Challenge> GetLastFinishedChallengeAsync();

        public Task<Challenge> GetLastActiveChallengeAsync();
        public Task<List<Challenge>> GetAllFinishedChallengesAsync();
        public Task<Challenge> AddChallengeAsync(Challenge newChallenge);
        public Task<bool> CheckIfUserUploadedAsync(int userId, int challengeId);
        public Task<Image?> GetWinningImageByChallengeIdAsync(int challengeId);
        public Task<Challenge?> UpdateWinnerImageAsync(int challengeId);
        public Task<Dictionary<string, int>> GetMonthlyUploadCountsAsync();
        public Task<Dictionary<string, int>> GetMonthlyRegistrationReportAsync();
    }
}
