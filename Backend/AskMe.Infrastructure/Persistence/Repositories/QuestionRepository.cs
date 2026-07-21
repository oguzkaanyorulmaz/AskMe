using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.Repositories;
using AskMe.Infrastructure.Persistence;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Infrastructure.Persistence.Repositories
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly IMongoCollection<EQuestion> questionCollection;

        public QuestionRepository(IMongoDbService _mongoDbService)
        {
            this.questionCollection = _mongoDbService.GetCollection<EQuestion>("Questions");
        }

        public async Task<Guid?> Create(EQuestion question)
        {
            question.Id = Guid.NewGuid();
            question.CreatedAt = DateTime.UtcNow;
            await this.questionCollection.InsertOneAsync(question);

            return question.Id;
        }

        public async Task<bool> DeleteById(Guid id)
        {
            DeleteResult result = await this.questionCollection.DeleteOneAsync(q => q.Id == id);
            return (result.DeletedCount > 0);
        }

        public async Task<EQuestion> GetById(Guid id)
        {
            return await this.questionCollection.Find(q => q.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<EQuestion>> ListByAskedToUsername(string username, int page, int pageSize)
        {
            int skip = (page - 1) * pageSize;

            var filter = Builders<EQuestion>.Filter.Eq(q => q.AskedToUsername, username);

            return await this.questionCollection
                .Find(filter)
                .SortByDescending(q => q.CreatedAt)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<bool> Update(EQuestion question)
        {
            var filter = Builders<EQuestion>.Filter.Eq(q => q.Id, question.Id);
            
            var result = await this.questionCollection.ReplaceOneAsync(filter, question);
            
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<List<EQuestion>> GetFeedQuestions(string currentUsername, List<string> followedUsernames, int page, int pageSize)
{
    int skip = (page - 1) * pageSize;

    var filter = Builders<EQuestion>.Filter.Or(
        Builders<EQuestion>.Filter.Eq(q => q.AskedToUsername, currentUsername),
        Builders<EQuestion>.Filter.Eq(q => q.AskedByUsername, currentUsername),
        Builders<EQuestion>.Filter.In(q => q.AskedToUsername, followedUsernames)
    );

    return await this.questionCollection
        .Find(filter)
        .SortByDescending(q => q.CreatedAt)
        .Skip(skip)
        .Limit(pageSize)
        .ToListAsync();
}

    }
}