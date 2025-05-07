using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.Models
{
    public class Challenge
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime? EndDate { get; set; }
        public int? WinnerImgId { get; set; }
        public Image? WinnerImg { get; set; }
        public int? WinnerUserId { get; set; }
        public User? WinnerUser { get; set; }
        public List<Image> Images { get; set; } = new List<Image>();
    }
}
