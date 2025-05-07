namespace PhotoChallenge.API.Models
{
    public class ImagePostModel
    {
        public int UserId { get; set; }
        public int ChallengeId { get; set; }
        public string ImageURL { get; set; }
        public string Caption { get; set; }
    }
}
