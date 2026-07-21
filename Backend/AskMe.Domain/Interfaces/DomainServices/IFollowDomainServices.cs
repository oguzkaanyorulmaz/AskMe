using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.DomainServices
{
    public interface IFollowDomainService
    {
        Task<bool> FollowUser(string followerUsername, string targetUsername);
        Task<bool> UnfollowUser(string followerUsername, string targetUsername);
        Task<bool> IsFollowing(string followerUsername, string targetUsername);
        Task<List<string>> GetFollowedUsernames(string followerUsername);
    }
}
