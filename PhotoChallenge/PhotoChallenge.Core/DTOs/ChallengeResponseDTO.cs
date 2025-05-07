using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core.DTOs
{
    public class ChallengeResponseDTO
    {
        public int Id { get; set; } 
        public string Title { get; set; }  
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? WinnerImageUrl { get; set; }
        public string? WinnerUserName { get; set; }
        public ChallengeResponseDTO() { }

        public ChallengeResponseDTO(Challenge challenge)
        {
            Id = challenge.Id;
            Title = challenge.Title;
            Description = challenge.Description;
            StartDate = challenge.StartDate;
            EndDate = challenge.EndDate;
            WinnerImageUrl = challenge.WinnerImg?.ImageURL;
            WinnerUserName = challenge.WinnerUser?.Name;
        }
    }
}

