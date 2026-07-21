using AskMe.Domain.CacheItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.Abstractions
{
    public interface ISystemSettingCacheProvider
    {
        public List<SystemSettingItem> GetAll();
        public void CleanAll();
        public void SetAll(List<SystemSettingItem> cacheItems);
    }
}