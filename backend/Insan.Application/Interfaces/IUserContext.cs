using Insan.Domain.Enums;

namespace Insan.Application.Interfaces;

public interface IUserContext
{
    Guid UserId { get; }
    UserRole Role { get; }
    bool IsAuthenticated { get; }
}
