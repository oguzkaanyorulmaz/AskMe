using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.Repositories;
using AskMe.Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AskMe.Infrastructure.Persistence.Repositories
{
    public class FollowRepository : IFollowRepository
    {
        private readonly IMongoCollection<EFollow> followCollection;

        public FollowRepository(IMongoDbService mongoDbService)
        {
            this.followCollection = mongoDbService.GetCollection<EFollow>("Follows");
        }

        public async Task<bool> Follow(EFollow follow)
        {
            var existing = await followCollection
                .Find(f => f.FollowerUsername == follow.FollowerUsername && f.FollowedUsername == follow.FollowedUsername)
                .FirstOrDefaultAsync();

            if (existing != null) return false;

            await followCollection.InsertOneAsync(follow);
            return true;
        }

        public async Task<bool> Unfollow(string followerUsername, string followedUsername)
        {
            var result = await followCollection.DeleteOneAsync(f => f.FollowerUsername == followerUsername && f.FollowedUsername == followedUsername);
            return result.DeletedCount > 0;
        }

        public async Task<bool> IsFollowing(string followerUsername, string followedUsername)
        {
            return await followCollection.Find(f => f.FollowerUsername == followerUsername && f.FollowedUsername == followedUsername).AnyAsync();
        }

        public async Task<List<string>> GetFollowedUsernames(string followerUsername)
        {
            var follows = await followCollection.Find(f => f.FollowerUsername == followerUsername).ToListAsync();
            return follows.Select(f => f.FollowedUsername).ToList();
        }
    }
}
