using AskMe.API.Middleware;
using AskMe.Application.DTOs.Authorization;
using AskMe.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AskMe.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthorizationAppService _authorizationAppService;

    public AuthController(IAuthorizationAppService authorizationService)
    {
        _authorizationAppService = authorizationService;
    }

    [HttpPost("Login")]
    public async Task<LoginResponse> Login([FromBody] LoginRequest request)
    {
        return await _authorizationAppService.Login(request);
    }

    [HttpPost("Logout")]
    [Secured]
    public async Task<LogoutResponse> Logout([FromBody] LogoutRequest request)
    {
        return await _authorizationAppService.Logout(request);
    }

    [HttpPost("Register")]
    public async Task<RegisterResponse> Register([FromBody] RegisterRequest request)
    {
        return await _authorizationAppService.Register(request);
    }
}