using Insan.Application.Interfaces;
using Insan.Domain.Entities;

namespace Insan.Application.Services;

public class LifeEventService
{
    private readonly ILifeEventRepository _lifeEventRepository;
    private readonly IJourneyRepository _journeyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public LifeEventService(
        ILifeEventRepository lifeEventRepository,
        IJourneyRepository journeyRepository,
        IUnitOfWork unitOfWork)
    {
        _lifeEventRepository = lifeEventRepository;
        _journeyRepository = journeyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<LifeEvent> CreateAsync(
        Guid journeyId,
        string title,
        string description,
        DateTime eventDate,
        int displayOrder,
        string? imageUrl = null,
        CancellationToken cancellationToken = default)
    {
        var journey = await _journeyRepository.GetByIdAsync(journeyId, cancellationToken)
            ?? throw new KeyNotFoundException($"Journey '{journeyId}' was not found.");

        var lifeEvent = new LifeEvent(journey.Id, title, description, eventDate, displayOrder, imageUrl);

        await _lifeEventRepository.AddAsync(lifeEvent, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return lifeEvent;
    }

    public async Task<LifeEvent> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _lifeEventRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"LifeEvent '{id}' was not found.");
    }

    public Task<IReadOnlyList<LifeEvent>> GetByJourneyAsync(
        Guid journeyId,
        CancellationToken cancellationToken = default)
        => _lifeEventRepository.GetByJourneyIdAsync(journeyId, cancellationToken);

    public async Task<LifeEvent> UpdateAsync(
        Guid id,
        string title,
        string description,
        DateTime eventDate,
        int displayOrder,
        string? imageUrl = null,
        CancellationToken cancellationToken = default)
    {
        var lifeEvent = await _lifeEventRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"LifeEvent '{id}' was not found.");

        lifeEvent.UpdateDetails(title, description, eventDate, displayOrder, imageUrl);

        await _lifeEventRepository.UpdateAsync(lifeEvent, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return lifeEvent;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var lifeEvent = await _lifeEventRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"LifeEvent '{id}' was not found.");

        await _lifeEventRepository.DeleteAsync(lifeEvent, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
