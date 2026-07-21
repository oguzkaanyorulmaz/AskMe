using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.Repositories;
using AskMe.Infrastructure.Persistence;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<EUser> userCollection;

        public UserRepository(IMongoDbService _mongoDbService)
        {
            this.userCollection = _mongoDbService.GetCollection<EUser>("Users");
        }

        public async Task<EUser> GetByUsername(string username)
        {
            return await this.userCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task<Guid?> Create(EUser user)
        {
            user.Id = Guid.NewGuid();
            await this.userCollection.InsertOneAsync(user);
            return user.Id;
        }

        public async Task<EUser> GetByEmail(string email)
        {
            return await this.userCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteByUsername(string username)
        {
            DeleteResult result = await this.userCollection.DeleteOneAsync(u => u.Username == username);
            return (result.DeletedCount > 0);
        }

        public async Task<List<EUser>> ListByPagination(int page, int pageSize)
        {
            int skip = (page - 1) * pageSize;

            var users = await this.userCollection
                .Find(_ => true)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();

            return users;
        }

        public async Task<bool> UpdateUser(EUser user)
        {
            var filter = Builders<EUser>.Filter.Eq(u => u.Username, user.Username);

            var updateCommand = Builders<EUser>.Update
                .Set(updated => updated.Email, user.Email)
                .Set(updated => updated.NameSurname, user.NameSurname)
                .Set(updated => updated.Bio, user.Bio)
                .Set(updated => updated.ProfilePictureUrl, user.ProfilePictureUrl)
                .Set(updated => updated.PasswordHash, user.PasswordHash)
                .Set(updated => updated.Status, user.Status)
                .Set(updated => updated.Role, user.Role);

            UpdateResult result = await this.userCollection.UpdateOneAsync(filter, updateCommand);

            return (result.ModifiedCount > 0);
        }
    }
}