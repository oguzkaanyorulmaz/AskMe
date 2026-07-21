using AskMe.Domain.Entities;

namespace AskMe.Domain.Interfaces.Repositories;

public interface IUserRepository
{
    Task<EUser> GetByUsername(string username);
    Task<EUser> GetByEmail(string email);
    Task<Guid?> Create(EUser user);
    Task<bool> DeleteByUsername(string username);
    Task<List<EUser>> ListByPagination(int page, int pageSize);
    Task<bool> UpdateUser(EUser user);
}