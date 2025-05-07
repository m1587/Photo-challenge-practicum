using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Core.Models;
using PhotoChallenge.Data;
using PhotoChallenge.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Service
{
    public class ImageService : IImageService
    {
        private readonly IManagerRepository _managerRepository;

        public ImageService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<Image?> GetImageByNameAsync(string imageName) =>
             await _managerRepository.Images.GetImageByNameAsync(imageName);

        public async Task<Image?> GetImageByIdAsync(int id) =>
             await _managerRepository.Images.GetImageByIdAsync(id);

        public async Task<List<Image>> GetImagesByChallengeIdAsync(int challengeId) =>
             await _managerRepository.Images.GetImagesByChallengeIdAsync(challengeId);

        public async Task<Image> AddImageAsync(Image image)
        {
            var addedImage = await _managerRepository.Images.AddImageAsync(image);
            await _managerRepository.SaveAsync(); 
            return addedImage;
        }
    }
}
