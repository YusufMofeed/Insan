using Insan.Application.Interfaces;
using Insan.Domain.Entities;

namespace Insan.Application.Services;

public class MemoryService
{
    private readonly IMemoryRepository _memoryRepository;
    private readonly IJourneyRepository _journeyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MemoryService(
        IMemoryRepository memoryRepository,
        IJourneyRepository journeyRepository,
        IUnitOfWork unitOfWork)
    {
        _memoryRepository = memoryRepository;
        _journeyRepository = journeyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Memory> CreateAsync(
        Guid journeyId,
        string url,
        string caption,
        CancellationToken cancellationToken = default)
    {
        var journey = await _journeyRepository.GetByIdAsync(journeyId, cancellationToken)
            ?? throw new KeyNotFoundException($"Journey '{journeyId}' was not found.");

        var memory = new Memory(journey.Id, url, caption);

        await _memoryRepository.AddAsync(memory, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return memory;
    }

    public async Task<Memory> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _memoryRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Memory '{id}' was not found.");
    }

    public Task<IReadOnlyList<Memory>> GetByJourneyAsync(
        Guid journeyId,
        CancellationToken cancellationToken = default)
        => _memoryRepository.GetByJourneyIdAsync(journeyId, cancellationToken);

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var memory = await _memoryRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Memory '{id}' was not found.");

        await _memoryRepository.DeleteAsync(memory, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
