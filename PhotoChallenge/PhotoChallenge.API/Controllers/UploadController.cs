using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace PhotoChallenge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        public UploadController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }
        [HttpGet("presigned-url")]
        [Authorize]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "photo-challenge-bucket-testpnoren",
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(5),
                //ContentType = "image/jpeg"
                ContentType = contentType
            };
  
            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url, });
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ListImages()
        {
            try
            {
                var request = new ListObjectsV2Request
                {
                    BucketName = "photo-challenge-bucket-testpnoren",
                };

                var response = await _s3Client.ListObjectsV2Async(request);
                var imageNames = response.S3Objects.Select(obj => obj.Key).ToList();

                return Ok(imageNames);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error receiving list Error receiving list of images: {ex.Message}");
            }
        }
    }
}
