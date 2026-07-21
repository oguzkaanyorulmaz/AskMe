using AskMe.Application.DTOs.Authorization;
using System.Threading.Tasks;

namespace AskMe.Application.Interfaces;

public interface IAuthorizationAppService
{
    Task<LoginResponse> Login(LoginRequest request);
    Task<LogoutResponse> Logout(LogoutRequest request);
    Task<RegisterResponse> Register(RegisterRequest request);
}