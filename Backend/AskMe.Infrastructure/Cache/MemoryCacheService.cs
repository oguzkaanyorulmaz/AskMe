using AskMe.Domain.Interfaces.Abstractions;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace AskMe.Infrastructure.Cache;

public class MemoryCacheService<T> : ICacheService<T>
{
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _defaultExpiration;

    public MemoryCacheService(IMemoryCache cache, TimeSpan? defaultExpiration = null)
    {
        _cache = cache;
        _defaultExpiration = defaultExpiration ?? TimeSpan.FromMinutes(5);
    }

    public void Set(string key, T value, TimeSpan? expiration = null)
    {
        var options = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? _defaultExpiration
        };
        _cache.Set(key, value, options);
    }

    public T? Get(string key)
    {
        return _cache.TryGetValue(key, out T? value) ? value : default;
    }

    public void Delete(string key)
    {
        _cache.Remove(key);
    }
}