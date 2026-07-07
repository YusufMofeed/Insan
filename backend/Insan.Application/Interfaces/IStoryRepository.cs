using Insan.Domain.Entities;

namespace Insan.Application.Interfaces;

public interface IStoryRepository
{
    Task<Story?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Story>> GetByJourneyIdAsync(Guid journeyId, CancellationToken cancellationToken = default);

    Task AddAsync(Story story, CancellationToken cancellationToken = default);

    Task DeleteAsync(Story story, CancellationToken cancellationToken = default);
}
