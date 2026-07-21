using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Common.Enums
{
    public enum AccountStatusEnum
    {
        WaitingActivation,
        WaitingAdminApprove,
        Active,
        Banned
    }
}