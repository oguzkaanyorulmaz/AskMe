using AskMe.Application.DTOs.QuestionManagement;
using AskMe.Domain.Entities;
using AutoMapper;
using System;

namespace AskMe.Application.Mappings;

public class QuestionAnswerMappingProfile : Profile
{
    public QuestionAnswerMappingProfile()
    {
        CreateMap<AskQuestionRequest, EQuestion>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AskedByUserId, opt => opt.Ignore())
            .ForMember(dest => dest.AskedToUserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            
    }
}