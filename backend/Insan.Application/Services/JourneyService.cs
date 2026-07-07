using Insan.Application.Interfaces;
using Insan.Domain.Entities;

namespace Insan.Application.Services;

public class JourneyService
{
    private readonly IJourneyRepository _journeyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public JourneyService(IJourneyRepository journeyRepository, IUnitOfWork unitOfWork)
    {
        _journeyRepository = journeyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Journey> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _journeyRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Journey '{id}' was not found.");
    }

    public Task<(IReadOnlyList<Journey> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        string? city,
        string? occupation,
        CancellationToken cancellationToken = default)
        => _journeyRepository.GetAllAsync(page, pageSize, search, city, occupation, cancellationToken);

    public async Task<Journey> CreateAsync(
        string fullName,
        string city,
        string occupation,
        string biography,
        Guid createdBy,
        string? nickname = null,
        DateTime? birthDate = null,
        DateTime? martyrdomDate = null,
        CancellationToken cancellationToken = default)
    {
        var journey = new Journey(fullName, city, occupation, biography, createdBy, nickname, birthDate, martyrdomDate);

        await _journeyRepository.AddAsync(journey, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return journey;
    }

    public async Task<Journey> UpdateAsync(
        Guid id,
        string fullName,
        string city,
        string occupation,
        string biography,
        string? nickname = null,
        DateTime? birthDate = null,
        DateTime? martyrdomDate = null,
        CancellationToken cancellationToken = default)
    {
        var journey = await _journeyRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Journey '{id}' was not found.");

        journey.UpdateDetails(fullName, city, occupation, biography, nickname, birthDate, martyrdomDate);

        await _journeyRepository.UpdateAsync(journey, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return journey;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var journey = await _journeyRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Journey '{id}' was not found.");

        journey.Archive();

        await _journeyRepository.UpdateAsync(journey, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
