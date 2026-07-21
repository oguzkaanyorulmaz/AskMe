using AutoMapper;
using AskMe.Application.DTOs.Authorization;
using AskMe.Application.Extensions;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using System.Threading.Tasks;

namespace AskMe.Application.Services;

public class AuthorizationAppService : IAuthorizationAppService
{
    private readonly IAuthorizationDomainService _authDomainService;
    private readonly IMapper _mapper;

    public AuthorizationAppService(IAuthorizationDomainService authDomainService, IMapper mapper)
    {
        _authDomainService = authDomainService;
        _mapper = mapper;
    }

    public async Task<LoginResponse> Login(LoginRequest request)
    {
        var result = await _authDomainService.Login(request.Username, request.Password);
        
        return new LoginResponse 
        { 
            Id = result.Id, 
            Username = result.Username, 
            AuthToken = result.AuthToken 
        };
    }

    public async Task<LogoutResponse> Logout(LogoutRequest request)
    {
        var result = _authDomainService.Logout(request.RequestContext.GetToken());
        
        return new LogoutResponse { IsSuccess = result.IsSuccess };
    }

    public async Task<RegisterResponse> Register(RegisterRequest request)
{
    var input = new AskMe.Domain.DomainObjects.Authorization.RegisterInput 
    {
        Username = request.Username,
        Password = request.Password,
        Mail = request.Email,
        NameSurname = request.NameSurname
    };
    
    var result = await _authDomainService.Register(input);
    
    return new RegisterResponse 
    {
        Id = result.Id,
        Username = result.Username,
        AuthToken = result.AuthToken
    };
}
}