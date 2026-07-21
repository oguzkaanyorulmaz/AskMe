using AskMe.Application.DTOs.ProfileManagement;
using AskMe.Domain.Entities;
using AskMe.Domain.CacheItems;
using AutoMapper;

namespace AskMe.Application.Mappings;

public class ProfileMappingProfile : Profile
{
    public ProfileMappingProfile()
    {
        CreateMap<EUser, UserInfo>(); 

        CreateMap<UserInfo, GetProfileResponse>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id));

        CreateMap<UpdateProfileRequest, EUser>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Username, opt => opt.Ignore())
            .ForMember(dest => dest.Email, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
    }
}