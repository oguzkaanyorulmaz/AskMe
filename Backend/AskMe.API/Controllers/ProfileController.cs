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
        [HttpPost("Follow")]
    [Secured]
    public async Task<FollowResponse> Follow([FromBody] FollowRequest request)
    {
        return await _profileAppService.Follow(request);
    }

    [HttpPost("Unfollow")]
    [Secured]
    public async Task<FollowResponse> Unfollow([FromBody] FollowRequest request)
    {
        return await _profileAppService.Unfollow(request);
    }

    [HttpGet("IsFollowing")]
    [Secured]
    public async Task<IsFollowingResponse> IsFollowing([FromQuery] string targetUsername)
    {
        string currentUsername = HttpContext.Items["username"]?.ToString() ?? "";
        return await _profileAppService.IsFollowing(targetUsername, currentUsername);
    }

    [HttpGet("List")]
    [Secured]
    public async Task<System.Collections.Generic.List<AskMe.Domain.CacheItems.UserInfo>> GetUserList([FromQuery] int page = 1)
    {
        return await _profileAppService.GetUserList(page);
    }
}