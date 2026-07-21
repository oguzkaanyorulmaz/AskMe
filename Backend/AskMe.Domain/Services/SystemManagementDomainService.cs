using AutoMapper;
using AskMe.Domain.CacheItems;
using AskMe.Domain.Common.Constants;
using AskMe.Domain.DomainObjects.SystemManagement;
using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.Abstractions;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Services
{
    public class SystemManagementDomainService : ISystemManagementDomainService
    {
        private readonly ISystemSettingRepository systemSettingRepository;
        private readonly ISystemSettingCacheProvider systemSettingCacheProvider;
        private readonly IMapper mapper;

        public SystemManagementDomainService(
            ISystemSettingRepository _systemSettingRepository,
            ISystemSettingCacheProvider _systemSettingCacheProvider,
            IMapper _mapper
        )
        {
            this.systemSettingRepository = _systemSettingRepository;
            this.systemSettingCacheProvider = _systemSettingCacheProvider;
            this.mapper = _mapper;
        }

        public async Task RestoreDefaults()
        {
            await this.systemSettingRepository.SetAll(SystemSetting.DEFAULTS);
        }

        public async Task<GetSystemSettingsResult> GetSystemSettings()
        {
            List<SystemSettingItem> cachedSystemSettings = this.systemSettingCacheProvider.GetAll();
            if(cachedSystemSettings.Count > 0)
            {
                return new GetSystemSettingsResult { Items = cachedSystemSettings };
            }

            List<ESystemSetting> dbStoredSettings = await this.systemSettingRepository.ListAll();
            
            cachedSystemSettings = this.mapper.Map<List<SystemSettingItem>>(dbStoredSettings);
            this.systemSettingCacheProvider.SetAll(cachedSystemSettings);

            return new GetSystemSettingsResult { Items = cachedSystemSettings };
        }

        public async Task<bool> SetSystemSettings(List<SystemSettingItem> settings)
        {
            try
            {
                List<ESystemSetting> entityItems = this.mapper.Map<List<ESystemSetting>>(settings);
                await this.systemSettingRepository.SetAll(entityItems);
                this.systemSettingCacheProvider.SetAll(settings);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}