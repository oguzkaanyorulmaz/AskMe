using AskMe.Domain.CacheItems;

namespace AskMe.Domain.Interfaces.Abstractions
{
    public interface IAuthSessionCacheProvider
    {
        public AuthSession? GetAuthInfoWithToken(string authToken);
        public AuthSession? GetAuthInfoWithUsername(string username);
        public void SetAuthInfo(string authToken, AuthSession authInfo);
        public void RemoveAuthInfo(string authToken);
    }
}