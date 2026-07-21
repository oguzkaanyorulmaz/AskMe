using AskMe.Application.DTOs.ProfileManagement;
using System.Threading.Tasks;

namespace AskMe.Application.Interfaces;

public interface IProfileAppService
{
    Task<GetProfileResponse> GetProfile(GetProfileRequest request);
    Task<UpdateProfileResponse> UpdateProfile(UpdateProfileRequest request);
}