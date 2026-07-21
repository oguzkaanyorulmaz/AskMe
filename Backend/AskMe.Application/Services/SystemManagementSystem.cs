using AskMe.Application.DTOs.SystemManagement;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using AutoMapper;
using System.Threading.Tasks;

namespace AskMe.Application.Services;

public class SystemManagementAppService : ISystemManagementAppService
{
    private readonly ISystemManagementDomainService _systemManagementDomainService;
    private readonly IMapper _mapper;

    public SystemManagementAppService(ISystemManagementDomainService systemManagementDomainService, IMapper mapper)
    {
        _systemManagementDomainService = systemManagementDomainService;
        _mapper = mapper;
    }

    public async Task<GetSystemSettingsResponse> GetSystemSettings(GetSystemSettingsRequest request)
    {

        var result = await _systemManagementDomainService.GetSystemSettings();

        return new GetSystemSettingsResponse { Items = result.Items };
    }

    public async Task<SetSystemSettingsResponse> SetSystemSettings(SetSystemSettingsRequest request)
    {
        bool operationResult = await _systemManagementDomainService.SetSystemSettings(request.Items);

        return new SetSystemSettingsResponse { IsSuccess = operationResult };
    }
}