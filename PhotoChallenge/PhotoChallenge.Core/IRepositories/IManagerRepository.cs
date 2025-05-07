using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IRepositories
{
    public interface IManagerRepository
    {
        IChallengeRepository Challenges { get; }
        IUserRepository Users { get; }
        IImageRepository Images { get; }
        IVoteRepository Votes { get; }

        Task SaveAsync(); 
    }
}
