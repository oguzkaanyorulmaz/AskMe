using AskMe.Infrastructure.Persistence;
using AskMe.Infrastructure.Services;          
using AskMe.Infrastructure.Cache.Providers;   
using AskMe.Infrastructure.Cache;          
using AskMe.Infrastructure.Configuration;  
using AskMe.Domain.Interfaces.Abstractions;    
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver; 
using StackExchange.Redis; 
using MongoDB.Bson;                
using MongoDB.Bson.Serialization;   
using MongoDB.Bson.Serialization.Serializers;

namespace AskMe.Infrastructure
{
    public static class InfrastructureAssembly
    {
        public static void InjectJWT(ref WebApplicationBuilder builder)
{

    builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

    builder.Services.AddSingleton<IJwtService, JwtService>();


}

        public static void InjectDatabase(ref WebApplicationBuilder builder)
        {   
            BsonSerializer.RegisterSerializer(new GuidSerializer(BsonType.String));
            builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

            var mongoConnectionString = builder.Configuration["MongoDbSettings:ConnectionString"] 
                                        ?? "mongodb://localhost:27017";

            builder.Services.AddSingleton<IMongoClient>(sp => new MongoClient(mongoConnectionString));
            builder.Services.AddSingleton<IMongoDbService, MongoDbService>();
        }

        public static void InjectCache(ref WebApplicationBuilder builder)
        {
            // 1. Redis Alt Yapı Bağlantıları
            var redisConnectionString = builder.Configuration["RedisSettings:ConnectionString"] ?? "localhost:6379";
            builder.Services.AddSingleton<IConnectionMultiplexer>(sp => ConnectionMultiplexer.Connect(redisConnectionString));
            builder.Services.AddSingleton<IRedisService, RedisService>();


            builder.Services.AddSingleton(typeof(RedisCacheService<>));

            builder.Services.AddSingleton(typeof(ICacheService<>), typeof(CacheService<>)); 

            builder.Services.AddSingleton<IAuthSessionCacheProvider, AuthSessionCacheProvider>();
            builder.Services.AddSingleton<ISystemSettingCacheProvider, SystemSettingCacheProvider>();
        }
    }
}