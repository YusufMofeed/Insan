using Insan.Domain.Entities;

namespace Insan.Application.Interfaces;

public interface IMemoryRepository
{
    Task<Memory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Memory>> GetByJourneyIdAsync(Guid journeyId, CancellationToken cancellationToken = default);

    Task AddAsync(Memory memory, CancellationToken cancellationToken = default);

    Task DeleteAsync(Memory memory, CancellationToken cancellationToken = default);
}
