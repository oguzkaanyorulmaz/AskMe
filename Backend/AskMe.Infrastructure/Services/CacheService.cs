using AskMe.Domain.Interfaces.Abstractions;
using AskMe.Infrastructure.Cache;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace AskMe.Infrastructure.Services;

public class CacheService<T> : ICacheService<T> where T : class
{
    private readonly ICacheService<T> _strategy;

    public CacheService(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        var cacheType = configuration["CacheSettings:Type"] ?? "Memory";

        if (cacheType == "Redis")
        {
            _strategy = serviceProvider.GetRequiredService<RedisCacheService<T>>();
        }
        else
        {
            _strategy = serviceProvider.GetRequiredService<MemoryCacheService<T>>();
        }
    }

    public void Set(string key, T value, TimeSpan? expiration = null) => _strategy.Set(key, value, expiration);
    public T? Get(string key) => _strategy.Get(key);
    public void Delete(string key) => _strategy.Delete(key);
}