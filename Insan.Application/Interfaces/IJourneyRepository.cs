using Insan.Domain.Entities;

namespace Insan.Application.Interfaces;

public interface IJourneyRepository
{
    Task<Journey?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<Journey> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        string? city,
        string? occupation,
        CancellationToken cancellationToken = default);

    Task AddAsync(Journey journey, CancellationToken cancellationToken = default);

    Task UpdateAsync(Journey journey, CancellationToken cancellationToken = default);
}
