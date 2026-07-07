using Insan.Domain.Entities;

namespace Insan.Application.Interfaces;

public interface ILifeEventRepository
{
    Task<LifeEvent?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LifeEvent>> GetByJourneyIdAsync(Guid journeyId, CancellationToken cancellationToken = default);

    Task AddAsync(LifeEvent lifeEvent, CancellationToken cancellationToken = default);

    Task UpdateAsync(LifeEvent lifeEvent, CancellationToken cancellationToken = default);

    Task DeleteAsync(LifeEvent lifeEvent, CancellationToken cancellationToken = default);
}
