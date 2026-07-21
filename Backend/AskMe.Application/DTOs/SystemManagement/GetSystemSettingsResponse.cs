using AskMe.Domain.CacheItems;
using System.Collections.Generic;

namespace AskMe.Application.DTOs.SystemManagement;

public class GetSystemSettingsResponse : ResponseDTO
{
    public required List<SystemSettingItem> Items { get; set; }
}