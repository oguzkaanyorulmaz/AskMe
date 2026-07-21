using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Domain.Services
{
    public class FollowDomainService : IFollowDomainService
    {
        private readonly IFollowRepository _followRepository;
        private readonly IUserRepository _userRepository;

        public FollowDomainService(IFollowRepository followRepository, IUserRepository userRepository)
        {
            _followRepository = followRepository;
            _userRepository = userRepository;
        }

        public async Task<bool> FollowUser(string followerUsername, string targetUsername)
        {
            if (string.Equals(followerUsername, targetUsername, StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception("Kendinizi takip edemezsiniz.");
            }

            var targetUser = await _userRepository.GetByUsername(targetUsername);
            if (targetUser == null)
            {
                throw new Exception("Takip edilmek istenen kullanıcı bulunamadı.");
            }

            var follow = new EFollow
            {
                FollowerUsername = followerUsername,
                FollowedUsername = targetUser.Username
            };

            return await _followRepository.Follow(follow);
        }

        public async Task<bool> UnfollowUser(string followerUsername, string targetUsername)
        {
            return await _followRepository.Unfollow(followerUsername, targetUsername);
        }

        public async Task<bool> IsFollowing(string followerUsername, string targetUsername)
        {
            return await _followRepository.IsFollowing(followerUsername, targetUsername);
        }

        public async Task<List<string>> GetFollowedUsernames(string followerUsername)
        {
            return await _followRepository.GetFollowedUsernames(followerUsername);
        }
    }
}
