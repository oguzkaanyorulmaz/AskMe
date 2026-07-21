using AskMe.Domain.CacheItems;
using AskMe.Domain.Entities;
using AutoMapper;

namespace AskMe.Application.Mappings;

public class SystemSettingMappingProfile : Profile
{
    public SystemSettingMappingProfile()
    {
        CreateMap<ESystemSetting, SystemSettingItem>().ReverseMap();
    }
}