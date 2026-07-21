using AskMe.Application.DTOs.ProfileManagement;
using System.Threading.Tasks;

namespace AskMe.Application.Interfaces;

public interface IProfileAppService
{
    Task<GetProfileResponse> GetProfile(GetProfileRequest request);
    Task<UpdateProfileResponse> UpdateProfile(UpdateProfileRequest request);
    Task<FollowResponse> Follow(FollowRequest request);
    Task<FollowResponse> Unfollow(FollowRequest request);
    Task<IsFollowingResponse> IsFollowing(string targetUsername, string currentUsername);
    Task<System.Collections.Generic.List<AskMe.Domain.CacheItems.UserInfo>> GetUserList(int page);
}