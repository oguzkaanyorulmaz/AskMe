using AskMe.API.Middleware;
using AskMe.Application.DTOs.SystemManagement;
using AskMe.Domain.Common.Enums;
using AskMe.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AskMe.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemManagementController : ControllerBase
{
    private readonly ISystemManagementAppService _systemManagementAppService;

    public SystemManagementController(ISystemManagementAppService systemManagementAppService)
    {
        _systemManagementAppService = systemManagementAppService;
    }

        [HttpGet("SystemSettings")]
    [Secured]
    [RoleRequired([UserRoleEnum.Admin])]
    public async Task<GetSystemSettingsResponse> GetSystemSettings([FromQuery] GetSystemSettingsRequest request)
    {
        return await _systemManagementAppService.GetSystemSettings(request);
    }

    [HttpPost("SystemSettings")]
    [Secured]
    [RoleRequired([UserRoleEnum.Admin])]
    public async Task<SetSystemSettingsResponse> SetSystemSettings([FromBody] SetSystemSettingsRequest request)
    {
        return await _systemManagementAppService.SetSystemSettings(request);
    }
}