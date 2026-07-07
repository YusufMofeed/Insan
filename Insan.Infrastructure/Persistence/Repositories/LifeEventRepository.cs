using Insan.Application.Interfaces;
using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insan.Infrastructure.Persistence.Repositories;

public class LifeEventRepository : BaseRepository<LifeEvent>, ILifeEventRepository
{
    public LifeEventRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<IReadOnlyList<LifeEvent>> GetByJourneyIdAsync(
        Guid journeyId,
        CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Where(lifeEvent => lifeEvent.JourneyId == journeyId)
            .OrderBy(lifeEvent => lifeEvent.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public Task UpdateAsync(LifeEvent lifeEvent, CancellationToken cancellationToken = default)
    {
        Update(lifeEvent);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(LifeEvent lifeEvent, CancellationToken cancellationToken = default)
    {
        DbSet.Remove(lifeEvent);
        return Task.CompletedTask;
    }
}
