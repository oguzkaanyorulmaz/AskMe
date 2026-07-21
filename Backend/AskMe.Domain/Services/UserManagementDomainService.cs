using AutoMapper;
using AskMe.Domain.CacheItems;
using AskMe.Domain.DomainObjects.UserManagement;
using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.Abstractions;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Domain.Services
{
    public class UserManagementDomainService : IUserManagementDomainService
    {
        private readonly IUserRepository userRepository;
        private readonly ICryptService cryptService;
        private readonly IMapper mapper;

        public UserManagementDomainService(
          IUserRepository _userRepository,
          ICryptService _cryptService,
          IMapper _mapper
        )
        {
            this.userRepository = _userRepository;
            this.cryptService = _cryptService;
            this.mapper = _mapper;
        }

        public async Task<CreateUserResult> CreateUser(CreateUserInput input)
        {
            bool isUserExistWithSameUsername = (await this.userRepository.GetByUsername(input.Username)) != null;
            if (isUserExistWithSameUsername)
            {
                throw new Exception("User name is already taken");
            }

            bool isUserExistWithSameMail = (await this.userRepository.GetByEmail(input.Email)) != null;
            if (isUserExistWithSameMail)
            {
                throw new Exception($"Mail address '{input.Email}' is already used by another user");
            }

            EUser user = new EUser
            {
                Username = input.Username,
                PasswordHash = this.cryptService.HashPassword(input.Password),
                Email = input.Email,
                Bio = input.Bio,
                ProfilePictureUrl = input.ProfilePictureUrl,
                Role = input.Role,
                Status = input.Status,
            };

            Guid? createdUserId = await this.userRepository.Create(user);

            UserInfo createdUser = this.mapper.Map<UserInfo>(user);

            return new CreateUserResult
            {
                Success = true,
                UserInfo = createdUser
            };
        }

        public async Task<bool> DeleteUser(string username)
        {
            bool result = await this.userRepository.DeleteByUsername(username);
            return result;
        }

        public async Task<List<UserInfo>> GetUserList(int pagination)
        {
            List<EUser> usersEntity = await this.userRepository.ListByPagination(pagination, 100);
            List<UserInfo> users = this.mapper.Map<List<UserInfo>>(usersEntity);

            return users;
        }

        public async Task<UpdateUserResult> UpdateUser(UpdateUserInput input)
        {
            try
            {
                EUser currentUserInfo = await this.userRepository.GetByUsername(input.Username);
                if (currentUserInfo == null)
                {
                    throw new Exception("User not found");
                }

                currentUserInfo.Email = input.Email ?? currentUserInfo.Email;
                currentUserInfo.Bio = input.Bio ?? currentUserInfo.Bio;
                currentUserInfo.ProfilePictureUrl = input.ProfilePictureUrl ?? currentUserInfo.ProfilePictureUrl;
                
                if(!string.IsNullOrEmpty(input.Password))
                {
                    currentUserInfo.PasswordHash = this.cryptService.HashPassword(input.Password);
                }

                currentUserInfo.Role = input.Role ?? currentUserInfo.Role;
                currentUserInfo.Status = input.Status;

                bool result = await this.userRepository.UpdateUser(currentUserInfo);
                UserInfo updatedUser = this.mapper.Map<UserInfo>(currentUserInfo);

                return new UpdateUserResult { Success = result, UserInfo = updatedUser };
            }
            catch (Exception ex)
            {
                return new UpdateUserResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<UserInfo> GetProfileByUsername(string username)
        {
            EUser userEntity = await this.userRepository.GetByUsername(username);
            
            if (userEntity == null)
            {
                return null; 
            }

            return this.mapper.Map<UserInfo>(userEntity);
        }
    }
}