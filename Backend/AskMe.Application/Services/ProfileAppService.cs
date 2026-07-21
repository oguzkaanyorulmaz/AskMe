using AskMe.Application.DTOs.ProfileManagement;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.DomainObjects.UserManagement;
using AutoMapper;
using System.Threading.Tasks;
using AskMe.Application.Extensions;

namespace AskMe.Application.Services;

public class ProfileAppService : IProfileAppService
{
    private readonly IUserManagementDomainService _userManagementDomainService;
    private readonly IMapper _mapper;

    public ProfileAppService(IUserManagementDomainService userManagementDomainService, IMapper mapper)
    {
        _userManagementDomainService = userManagementDomainService;
        _mapper = mapper;
    }

    public async Task<GetProfileResponse> GetProfile(GetProfileRequest request)
    {
        var user = await _userManagementDomainService.GetProfileByUsername(request.TargetUsername);
        return _mapper.Map<GetProfileResponse>(user);
    }

    public async Task<UpdateProfileResponse> UpdateProfile(UpdateProfileRequest request)
    {
        var input = new UpdateUserInput
        {
            Username = request.RequestContext.GetUsername(), 
            Bio = request.Bio,

        };

        var result = await _userManagementDomainService.UpdateUser(input);

        return new UpdateProfileResponse { IsSuccess = result != null };
    }
}