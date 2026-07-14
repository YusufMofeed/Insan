using Insan.Application.DTOs;
using Insan.Application.Interfaces;

namespace Insan.Application.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserContext _userContext;

    public UserService(IUserRepository userRepository, IUserContext userContext)
    {
        _userRepository = userRepository;
        _userContext = userContext;
    }

    public async Task<CurrentUserResponse> GetCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(_userContext.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"User '{_userContext.UserId}' was not found.");

        return new CurrentUserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt
        };
    }
}
