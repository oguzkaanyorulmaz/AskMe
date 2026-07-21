using AskMe.Domain.DomainObjects.Authorization;

namespace AskMe.Domain.Interfaces.DomainServices;

public interface IAuthorizationDomainService
{
    public Task<LoginResult> Login(string username, string password);
    public LogoutResult Logout(string authToken);
    public Task<RegisterResult> Register(RegisterInput input);
}