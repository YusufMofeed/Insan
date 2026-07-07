using Insan.Application.Interfaces;
using Insan.Domain.Entities;

namespace Insan.Application.Services;

public class StoryService
{
    private readonly IStoryRepository _storyRepository;
    private readonly IJourneyRepository _journeyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StoryService(
        IStoryRepository storyRepository,
        IJourneyRepository journeyRepository,
        IUnitOfWork unitOfWork)
    {
        _storyRepository = storyRepository;
        _journeyRepository = journeyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Story> CreateAsync(
        Guid journeyId,
        string title,
        string content,
        string authorName,
        CancellationToken cancellationToken = default)
    {
        var journey = await _journeyRepository.GetByIdAsync(journeyId, cancellationToken)
            ?? throw new KeyNotFoundException($"Journey '{journeyId}' was not found.");

        var story = new Story(journey.Id, title, content, authorName);

        await _storyRepository.AddAsync(story, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return story;
    }

    public async Task<Story> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _storyRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Story '{id}' was not found.");
    }

    public Task<IReadOnlyList<Story>> GetByJourneyAsync(
        Guid journeyId,
        CancellationToken cancellationToken = default)
        => _storyRepository.GetByJourneyIdAsync(journeyId, cancellationToken);

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var story = await _storyRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Story '{id}' was not found.");

        await _storyRepository.DeleteAsync(story, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
