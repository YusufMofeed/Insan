using Insan.Application.Interfaces;
using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insan.Infrastructure.Persistence.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Email == email, cancellationToken);
    }

    public Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        Update(user);
        return Task.CompletedTask;
    }
}
