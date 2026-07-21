using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Infrastructure.Persistence
{
    public interface IRedisService
    {
        IDatabase GetDatabase();
    }
}