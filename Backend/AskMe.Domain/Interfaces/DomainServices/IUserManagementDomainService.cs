using AskMe.Domain.CacheItems;
using AskMe.Domain.DomainObjects.UserManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.DomainServices
{
    public interface IUserManagementDomainService
    {
        Task<CreateUserResult> CreateUser(CreateUserInput input);
        
        Task<UpdateUserResult> UpdateUser(UpdateUserInput input);
        
        Task<bool> DeleteUser(string username);
        
        Task<List<UserInfo>> GetUserList(int pagination);
        
        Task<UserInfo> GetProfileByUsername(string username);
    }
}