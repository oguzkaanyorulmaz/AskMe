using AskMe.Domain.CacheItems;
using AskMe.Domain.Common.Constants;
using AskMe.Domain.Common.Enums;
using AskMe.Domain.DomainObjects.Authorization;
using AskMe.Domain.DomainObjects.SystemManagement;
using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.Abstractions;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.Interfaces.Repositories;

namespace AskMe.Domain.Services
{
    public class AuthorizationDomainService : IAuthorizationDomainService
    {
        private readonly IUserRepository userRepository;
        private readonly ICryptService cryptService;
        private readonly IJwtService jwtService;
        private readonly IAuthSessionCacheProvider authSessionCacheProvider;
        private readonly ISystemManagementDomainService systemManagementDomainService;

        public AuthorizationDomainService(
            IUserRepository _userRepository, 
            ICryptService _cryptService,
            IJwtService _jwtService, 
            IAuthSessionCacheProvider _authSessionCacheProvider,
            ISystemManagementDomainService _systemManagementDomainService
        )
        {
            this.userRepository = _userRepository;
            this.cryptService = _cryptService;
            this.jwtService = _jwtService;
            this.authSessionCacheProvider = _authSessionCacheProvider;
            this.systemManagementDomainService = _systemManagementDomainService;
        }

        public async Task<LoginResult> Login(string username, string password)
        {
            EUser user = await this.userRepository.GetByUsername(username);
            if (user == null)
            {
                throw new Exception("User not exists");
            }

            if (!user.IsPasswordValid(password, this.cryptService))
            {
                throw new Exception("Invalid password");
            }

            string token = this.jwtService.GenerateToken(user.Username);

            this.authSessionCacheProvider.SetAuthInfo(token, new AuthSession
            {
                
                UserName = user.Username,
                AuthToken = token,
                Role = user.Role
            });

            return new LoginResult
            {
                Id = user.Id,
                Username = user.Username,
                AuthToken = token
            };
        }

        public LogoutResult Logout(string? authToken)
        {
            if (string.IsNullOrEmpty(authToken))
            {
                throw new Exception("Auth token is required");
            }

            AuthSession? authSession = this.authSessionCacheProvider.GetAuthInfoWithToken(authToken);
            if (authSession == null)
            {
                throw new Exception("Invalid session");
            }

            this.authSessionCacheProvider.RemoveAuthInfo(authToken);
            return new LogoutResult { IsSuccess = true };
        }

        public async Task<RegisterResult> Register(RegisterInput input)
        {
            bool isUserExistWithSameUsername = (await this.userRepository.GetByUsername(input.Username)) != null;
            if (isUserExistWithSameUsername)
            {
                throw new Exception("User name is already taken");
            }

            bool isUserExistWithSameMail = (await this.userRepository.GetByEmail(input.Mail)) != null;
            if (isUserExistWithSameMail)
            {
                throw new Exception($"Mail address '{input.Mail}' is already used by another user");
            }

            GetSystemSettingsResult systemSettings = await this.systemManagementDomainService.GetSystemSettings();

            UserRoleEnum registerUserRole = systemSettings.GetValue<UserRoleEnum>(SystemSetting.REGISTER_USER_ROLE);
            AccountStatusEnum registerUserAccountStatus = systemSettings.GetValue<AccountStatusEnum>(SystemSetting.REGISTER_USER_ACCOUNT_STATUS);

            EUser user = new EUser
            {
                Username = input.Username,
                PasswordHash = this.cryptService.HashPassword(input.Password),
                Email = input.Mail,
                NameSurname = input.NameSurname,
                Role = registerUserRole,
                Status = registerUserAccountStatus,
            };

            await this.userRepository.Create(user);

            string token = this.jwtService.GenerateToken(user.Username);

            this.authSessionCacheProvider.SetAuthInfo(token, new AuthSession
            {
                UserName = user.Username,
                AuthToken = token,
                Role = user.Role
            });

            return new RegisterResult
            {
                Id = user.Id,
                Username = user.Username,
                AuthToken = token
            };
        }
    }
}