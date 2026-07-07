using Insan.Application.Interfaces;
using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insan.Infrastructure.Persistence.Repositories;

public class StoryRepository : BaseRepository<Story>, IStoryRepository
{
    public StoryRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<IReadOnlyList<Story>> GetByJourneyIdAsync(
        Guid journeyId,
        CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Where(story => story.JourneyId == journeyId)
            .OrderByDescending(story => story.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task DeleteAsync(Story story, CancellationToken cancellationToken = default)
    {
        DbSet.Remove(story);
        return Task.CompletedTask;
    }
}
