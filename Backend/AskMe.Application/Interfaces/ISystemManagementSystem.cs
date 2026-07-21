using AskMe.Application.DTOs.SystemManagement;
using System.Threading.Tasks;

namespace AskMe.Application.Interfaces;

public interface ISystemManagementAppService
{
    Task<GetSystemSettingsResponse> GetSystemSettings(GetSystemSettingsRequest request);
    Task<SetSystemSettingsResponse> SetSystemSettings(SetSystemSettingsRequest request);
}