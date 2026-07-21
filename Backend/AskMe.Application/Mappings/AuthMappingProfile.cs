using AutoMapper;
using AskMe.Application.DTOs.Authorization;
using AskMe.Domain.DomainObjects.Authorization;

namespace AskMe.Application.Mappings
{
    public class AuthMappingProfile : Profile
    {
        public AuthMappingProfile()
        {
            CreateMap<RegisterRequest, RegisterInput>().ReverseMap();
            CreateMap<RegisterResponse, RegisterResult>().ReverseMap();
        }
    }
}