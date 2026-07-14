using Insan.Application.Interfaces;
using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insan.Infrastructure.Persistence.Repositories;

public class JourneyRepository : BaseRepository<Journey>, IJourneyRepository
{
    public JourneyRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public new async Task<Journey?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Include(journey => journey.Creator)
            .FirstOrDefaultAsync(journey => journey.Id == id, cancellationToken);
    }

    public async Task<(IReadOnlyList<Journey> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        string? city,
        string? occupation,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Journey> query = DbSet.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(journey => journey.FullName.Contains(search));

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(journey => journey.City == city);

        if (!string.IsNullOrWhiteSpace(occupation))
            query = query.Where(journey => journey.Occupation == occupation);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(journey => journey.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task UpdateAsync(Journey journey, CancellationToken cancellationToken = default)
    {
        Update(journey);
        return Task.CompletedTask;
    }
}
