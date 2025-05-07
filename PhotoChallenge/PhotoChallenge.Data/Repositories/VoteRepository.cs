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
    public class VoteRepository : Repository<Vote>, IVoteRepository
    {
        private readonly DataContext _context;

        public VoteRepository(DataContext context) : base(context) { _context = context; }


        public async Task<Vote?> GetVoteAsync(int userId) =>
            await _dbSet.AsNoTracking().FirstOrDefaultAsync(v => v.UserId == userId);

        public async Task AddVoteAsync(Vote vote)
        {
            var existingVote = await _dbSet.FirstOrDefaultAsync(v => v.UserId == vote.UserId);

            if (existingVote != null)
            {
                if (existingVote.ImageId == vote.ImageId)
                {
                    return;
                }
                // הסרת ההצבעה מהתמונה הקודמת
                var previousImage = await _context.Images.FirstOrDefaultAsync(i => i.Id == existingVote.ImageId);
                if (previousImage != null)
                {
                    previousImage.Votes.Remove(existingVote);
                }

                // עדכון הצבעה בתמונה החדשה
                existingVote.ImageId = vote.ImageId;
                _dbSet.Update(existingVote);
            }
            else
            {
                // הוספת הצבעה חדשה
                await _dbSet.AddAsync(vote);
            }

        }

        public async Task<int> GetVotesCountAsync(int imageId) =>
            await _dbSet.CountAsync(v => v.ImageId == imageId);
    }
}
