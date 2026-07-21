using MongoDB.Driver;

namespace AskMe.Infrastructure.Persistence;

public interface IMongoDbService
{
    IMongoCollection<T> GetCollection<T>(string collectionName);
}