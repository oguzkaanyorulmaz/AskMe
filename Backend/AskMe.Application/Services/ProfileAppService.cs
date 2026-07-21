using AskMe.Application.DTOs.ProfileManagement;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.DomainObjects.UserManagement;
using AutoMapper;
using System.Threading.Tasks;
using AskMe.Application.Extensions;

namespace AskMe.Application.Services;

public class ProfileAppService : IProfileAppService
{
    private readonly IUserManagementDomainService _userManagementDomainService;
    private readonly IMapper _mapper;
    private readonly IFollowDomainService _followDomainService;

    public ProfileAppService(
        IUserManagementDomainService userManagementDomainService, 
        IMapper mapper, 
        IFollowDomainService followDomainService)
    {
        _userManagementDomainService = userManagementDomainService;
        _mapper = mapper;
        _followDomainService = followDomainService;
    }

    public async Task<GetProfileResponse> GetProfile(GetProfileRequest request)
    {
        var user = await _userManagementDomainService.GetProfileByUsername(request.TargetUsername);
        return _mapper.Map<GetProfileResponse>(user);
    }

    public async Task<UpdateProfileResponse> UpdateProfile(UpdateProfileRequest request)
    {
        var input = new UpdateUserInput
        {
            Username = request.RequestContext.GetUsername(), 
            Bio = request.Bio,
        };

        var result = await _userManagementDomainService.UpdateUser(input);
        return new UpdateProfileResponse { IsSuccess = result != null };
    }

    public async Task<FollowResponse> Follow(FollowRequest request)
    {
        var success = await _followDomainService.FollowUser(
            request.RequestContext.GetUsername(),
            request.TargetUsername
        );
        return new FollowResponse { IsSuccess = success };
    }

    public async Task<FollowResponse> Unfollow(FollowRequest request)
    {
        var success = await _followDomainService.UnfollowUser(
            request.RequestContext.GetUsername(),
            request.TargetUsername
        );
        return new FollowResponse { IsSuccess = success };
    }

    public async Task<IsFollowingResponse> IsFollowing(string targetUsername, string currentUsername)
    {
        var isFollowing = await _followDomainService.IsFollowing(currentUsername, targetUsername);
        return new IsFollowingResponse { IsFollowing = isFollowing, IsSuccess = true };
    }

    public async Task<System.Collections.Generic.List<AskMe.Domain.CacheItems.UserInfo>> GetUserList(int page)
    {
        return await _userManagementDomainService.GetUserList(page);
    }
}
