using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.Repositories;
using AskMe.Infrastructure.Persistence;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Infrastructure.Persistence.Repositories
{
    public class AnswerRepository : IAnswerRepository
    {
        private readonly IMongoCollection<EAnswer> answerCollection;

        public AnswerRepository(IMongoDbService _mongoDbService)
        {
            this.answerCollection = _mongoDbService.GetCollection<EAnswer>("Answers");
        }

        public async Task<Guid?> Create(EAnswer answer)
        {
            if (answer.Id == Guid.Empty)
            {
                answer.Id = Guid.NewGuid();
            }
            
            await this.answerCollection.InsertOneAsync(answer);
            return answer.Id;
        }

        public async Task<bool> DeleteById(Guid id)
        {
            var result = await this.answerCollection.DeleteOneAsync(a => a.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<EAnswer> GetById(Guid id)
        {
            return await this.answerCollection.Find(a => a.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateAnswer(EAnswer answer)
        {
            var filter = Builders<EAnswer>.Filter.Eq(a => a.Id, answer.Id);
            var result = await this.answerCollection.ReplaceOneAsync(filter, answer);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

       public async Task<List<EAnswer>> GetByQuestionId(Guid questionId)
{
        return await this.answerCollection.Find(a => a.QuestionId == questionId).ToListAsync();
}
    }
}