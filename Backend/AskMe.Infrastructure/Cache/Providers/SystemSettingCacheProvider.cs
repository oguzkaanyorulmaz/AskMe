using AskMe.Domain.CacheItems;
using AskMe.Domain.Common.Constants;
using AskMe.Domain.Interfaces.Abstractions;
using System.Collections.Generic;

namespace AskMe.Infrastructure.Cache.Providers
{
    public class SystemSettingCacheProvider : ISystemSettingCacheProvider
    {
        private readonly ICacheService<SystemSettingItem> cacheService;

        public SystemSettingCacheProvider(ICacheService<SystemSettingItem> _cacheService)
        {
            this.cacheService = _cacheService;
        }

        public List<SystemSettingItem> GetAll()
        {
            List<SystemSettingItem> systemSettingCacheItemList = new List<SystemSettingItem>();
            foreach(string eachKey in SystemSetting.ALL)
            {
                SystemSettingItem? item = this.cacheService.Get($"systemsetting->{eachKey}");
                if(item != null)
                {
                    systemSettingCacheItemList.Add(item);
                }
            }

            return systemSettingCacheItemList;
        }

        public void CleanAll()
        {
            foreach (string eachKey in SystemSetting.ALL)
            {
                this.cacheService.Delete($"systemsetting->{eachKey}");
            }
        }

        public void SetAll(List<SystemSettingItem> cacheItems)
        {
            foreach (SystemSettingItem eachItem in cacheItems)
            {
                this.cacheService.Set($"systemsetting->{eachItem.Key}", eachItem);
            }
        }
    }
}