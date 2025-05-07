using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IServices
{
    public interface IVoteService
    {
        public Task<Vote?> GetVoteAsync(int userId);
        public Task AddVoteAsync(Vote vote);
        public Task<int> GetVotesCountAsync(int imageId);
    }
}
