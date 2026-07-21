using AskMe.Domain.Common.Enums;
using AskMe.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Common.Constants
{
    public class SystemSetting
    {
        public static readonly string ORGANIZATION = "ORGANIZATION";
        public static readonly string REGISTER_USER_ACCOUNT_STATUS = "REGISTER_USER_ACCOUNT_STATUS";
        public static readonly string REGISTER_USER_ROLE = "REGISTER_USER_ROLE";
        
        public static readonly string QUESTION_MAX_CHARACTER_LIMIT = "QUESTION_MAX_CHARACTER_LIMIT";
        public static readonly string ALLOW_ANONYMOUS_QUESTIONS = "ALLOW_ANONYMOUS_QUESTIONS";

        public static readonly string[] ALL =
        {
            SystemSetting.ORGANIZATION,
            SystemSetting.REGISTER_USER_ACCOUNT_STATUS,
            SystemSetting.REGISTER_USER_ROLE,
            SystemSetting.QUESTION_MAX_CHARACTER_LIMIT,
            SystemSetting.ALLOW_ANONYMOUS_QUESTIONS
        };

        public static readonly List<ESystemSetting> DEFAULTS = new List<ESystemSetting>
        {
            new ESystemSetting
            {
                Key = SystemSetting.ORGANIZATION,
                Value = "AskMe Network"
            },
            new ESystemSetting
            {
                Key = SystemSetting.REGISTER_USER_ACCOUNT_STATUS,
                Value = AccountStatusEnum.Active 
            },
            new ESystemSetting
            {
                Key = SystemSetting.REGISTER_USER_ROLE,
                Value = UserRoleEnum.User
            },
            new ESystemSetting
            {
                Key = SystemSetting.QUESTION_MAX_CHARACTER_LIMIT,
                Value = 300
            },
            new ESystemSetting
            {
                Key = SystemSetting.ALLOW_ANONYMOUS_QUESTIONS,
                Value = true
            }
        };
    }
}