using Insan.Application.Interfaces;
using Insan.Domain.Entities;
using Insan.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Insan.Infrastructure.Persistence.Repositories;

public class VoiceRepository : BaseRepository<Voice>, IVoiceRepository
{
    public VoiceRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public new async Task<Voice?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Include(voice => voice.User)
            .FirstOrDefaultAsync(voice => voice.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Voice>> GetByJourneyIdAsync(
        Guid journeyId,
        bool onlyApproved = false,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Voice> query = DbSet
            .AsNoTracking()
            .Include(voice => voice.User)
            .Where(voice => voice.JourneyId == journeyId);

        if (onlyApproved)
            query = query.Where(voice => voice.Status == VoiceStatus.Approved);

        return await query
            .OrderByDescending(voice => voice.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task UpdateAsync(Voice voice, CancellationToken cancellationToken = default)
    {
        Update(voice);
        return Task.CompletedTask;
    }
}
