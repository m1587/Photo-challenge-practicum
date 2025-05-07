using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.IServices
{
    public interface IImageService
    {
        public Task<Image?> GetImageByIdAsync(int id);
        public Task<Image?> GetImageByNameAsync(string imageName);
        public Task<List<Image>> GetImagesByChallengeIdAsync(int challengeId);
        public Task<Image> AddImageAsync(Image image);
    }
}
