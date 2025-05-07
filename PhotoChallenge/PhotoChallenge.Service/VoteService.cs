
using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Core.Models;
using PhotoChallenge.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace PhotoChallenge.Service
{
    public class VoteService:IVoteService
    {
        private readonly IManagerRepository _managerRepository;

        public VoteService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<Vote?> GetVoteAsync(int userId) =>
            await _managerRepository.Votes.GetVoteAsync(userId);

        public async Task AddVoteAsync(Vote vote)
        {
            await _managerRepository.Votes.AddVoteAsync(vote);
            await _managerRepository.SaveAsync();
        }

        public async Task<int> GetVotesCountAsync(int imageId) =>
            await _managerRepository.Votes.GetVotesCountAsync(imageId);
    }
}

