using PhotoChallenge.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Data.Repositories
{
    public class ManagerRepository: IManagerRepository
    {
        private readonly DataContext _context;

        // כל ה-Repositories שאתה רוצה לנהל
        public IChallengeRepository Challenges { get; }
        public IUserRepository Users { get; }
        public IImageRepository Images { get; }
        public IVoteRepository Votes { get; }

        // Constructor שבו אתה מזריק את כל ה-Repositories
        public ManagerRepository(DataContext context, IChallengeRepository challengeRepository, IUserRepository userRepository, IImageRepository imageRepository, IVoteRepository voteRepository)
        {
            _context = context;
            Challenges = challengeRepository;
            Users = userRepository;
            Images = imageRepository;
            Votes = voteRepository;
        }

        // SaveAsync - שמירת כל השינויים שנעשו ב-DbContext
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
