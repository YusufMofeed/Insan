using Insan.Domain.Entities;

namespace Insan.Application.Interfaces;

public interface IVoiceRepository
{
    Task<Voice?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Voice>> GetByJourneyIdAsync(
        Guid journeyId,
        bool onlyApproved = false,
        CancellationToken cancellationToken = default);

    Task AddAsync(Voice voice, CancellationToken cancellationToken = default);

    Task UpdateAsync(Voice voice, CancellationToken cancellationToken = default);
}
