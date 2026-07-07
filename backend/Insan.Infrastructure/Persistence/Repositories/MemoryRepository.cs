using Insan.Application.Interfaces;
using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insan.Infrastructure.Persistence.Repositories;

public class MemoryRepository : BaseRepository<Memory>, IMemoryRepository
{
    public MemoryRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<IReadOnlyList<Memory>> GetByJourneyIdAsync(
        Guid journeyId,
        CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Where(memory => memory.JourneyId == journeyId)
            .OrderByDescending(memory => memory.UploadedAt)
            .ToListAsync(cancellationToken);
    }

    public Task DeleteAsync(Memory memory, CancellationToken cancellationToken = default)
    {
        DbSet.Remove(memory);
        return Task.CompletedTask;
    }
}
