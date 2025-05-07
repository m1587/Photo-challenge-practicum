using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.Models
{
    public class Vote
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int ImageId { get; set; }
        public Image Image { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
