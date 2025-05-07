using Microsoft.EntityFrameworkCore;
using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Core.Models;
using PhotoChallenge.Data;
using PhotoChallenge.Data.Repositories;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Service
{
    public class ChallengeService : IChallengeService
    {
        private readonly IManagerRepository _repositoryManager;

        public ChallengeService(IManagerRepository repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }
        public async Task<Challenge?> GetLastFinishedChallengeAsync() =>
            await _repositoryManager.Challenges.GetLastFinishedChallengeAsync();

        public async Task<Challenge?> GetLastActiveChallengeAsync() =>
            await _repositoryManager.Challenges.GetLastActiveChallengeAsync();

        public async Task<List<Challenge>> GetAllFinishedChallengesAsync() =>
           await _repositoryManager.Challenges.GetAllFinishedChallengesAsync();

        public async Task<Challenge> AddChallengeAsync(Challenge newChallenge)
        {
            if (newChallenge == null)
                return null;
            var challenge = await _repositoryManager.Challenges.AddChallengeAsync(newChallenge);
            await _repositoryManager.SaveAsync();
            return challenge;
        }


        public async Task<bool> CheckIfUserUploadedAsync(int userId, int challengeId) =>
            await _repositoryManager.Challenges.CheckIfUserUploadedAsync(userId, challengeId);

        public async Task<Image?> GetWinningImageByChallengeIdAsync(int challengeId)
        {
            return await _repositoryManager.Challenges.GetWinningImageByChallengeIdAsync(challengeId);
        }
        public async Task<Challenge?> UpdateWinnerImageAsync(int challengeId)
        {
            return await _repositoryManager.Challenges.UpdateWinnerImageAsync(challengeId);
        }

        public async Task<Dictionary<string, int>> GetMonthlyUploadCountsAsync()
        {
            return await _repositoryManager.Challenges.GetMonthlyUploadCountsAsync();
        }
        public async Task<Dictionary<string, int>> GetMonthlyRegistrationReportAsync()
        {
            return await _repositoryManager.Challenges.GetMonthlyRegistrationReportAsync();
        }
    }
}
