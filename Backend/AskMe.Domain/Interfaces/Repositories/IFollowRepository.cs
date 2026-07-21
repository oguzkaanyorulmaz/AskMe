using AskMe.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.Repositories
{
    public interface IFollowRepository
    {
        Task<bool> Follow(EFollow follow);
        Task<bool> Unfollow(string followerUsername, string followedUsername);
        Task<bool> IsFollowing(string followerUsername, string followedUsername);
        Task<List<string>> GetFollowedUsernames(string followerUsername);
    }
}
