using AskMe.API.Middleware;
using AskMe.Application.DTOs.ProfileManagement;
using AskMe.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AskMe.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly IProfileAppService _profileAppService;

    public ProfileController(IProfileAppService profileAppService)
    {
        _profileAppService = profileAppService;
    }

    [HttpPost("View")]
    public async Task<GetProfileResponse> GetProfile([FromBody] GetProfileRequest request)
    {
        return await _profileAppService.GetProfile(request);
    }

    [HttpPut("Update")]
    [Secured]
    public async Task<UpdateProfileResponse> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        return await _profileAppService.UpdateProfile(request);
    }
}