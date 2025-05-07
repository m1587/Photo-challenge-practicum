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
    public class ImageRepository : Repository<Image>, IImageRepository
    {
        private readonly DataContext _context;
        public ImageRepository(DataContext context) : base(context) { _context = context; }
        public async Task<Image?> GetImageByIdAsync(int id) =>
            await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);

        public async Task<Image?> GetImageByNameAsync(string imageName) =>
            await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.ImageURL.Contains(imageName));

        public async Task<List<Image>> GetImagesByChallengeIdAsync(int challengeId)
        {
            var images = await _dbSet.Where(i => i.ChallengeId == challengeId).ToListAsync();
            return images;
        }

        public async Task<Image> AddImageAsync(Image image)
        {
            var lastChallenge = await _context.Challenges.OrderByDescending(c => c.EndDate)
                .FirstOrDefaultAsync(c => c.EndDate > DateTime.Now);

            if (lastChallenge != null)
                lastChallenge.Images.Add(image);

            await _dbSet.AddAsync(image);
            return image;
        }
        
    }
}
