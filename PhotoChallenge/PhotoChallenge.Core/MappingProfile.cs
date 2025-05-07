using AutoMapper;
using PhotoChallenge.Core.DTOs;
using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoChallenge.Core
{
    public class MappingProfile : Profile
    {
        public  MappingProfile()
        {
            CreateMap<User, UserResponseDTO>();
            CreateMap<Challenge, ChallengeResponseDTO>()
                .ForMember(dest => dest.WinnerImageUrl, opt => opt.MapFrom(src => src.WinnerImg != null ? src.WinnerImg.ImageURL : null))
                .ForMember(dest => dest.WinnerUserName, opt => opt.MapFrom(src => src.WinnerUser != null ? src.WinnerUser.Name : null));
            CreateMap<Image, ImageResponseDTO>();
        }
        
    }
}
