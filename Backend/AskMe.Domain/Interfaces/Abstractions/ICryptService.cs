namespace AskMe.Domain.Interfaces.Abstractions;

public interface ICryptService
{
    string HashPassword(string password);
}