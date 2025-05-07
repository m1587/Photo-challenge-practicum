using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class ImageResponseDTO
    {
        public int Id { get; set; }
        public string ImageURL { get; set; }
        public string Caption { get; set; }
        public int UserId { get; set; }
        public int ChallengeId { get; set; }
        public DateTime UploadedAt { get; set; }
        public ImageResponseDTO() { }
        public ImageResponseDTO(PhotoChallenge.Core.Models.Image image)
        {
            Id = image.Id;
            ImageURL = image.ImageURL;
            Caption = image.Caption;
            UserId = image.UserId;
            ChallengeId = image.ChallengeId;
            UploadedAt = image.UploadedAt;
        }
    }
}
