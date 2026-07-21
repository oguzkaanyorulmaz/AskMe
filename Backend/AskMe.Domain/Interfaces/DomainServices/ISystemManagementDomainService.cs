using AskMe.Domain.CacheItems;
using AskMe.Domain.DomainObjects.SystemManagement;
using AskMe.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.DomainServices
{
    public interface ISystemManagementDomainService
    {
        public Task<GetSystemSettingsResult> GetSystemSettings();
        public Task<bool> SetSystemSettings(List<SystemSettingItem> settings);
        public Task RestoreDefaults();
    }
}