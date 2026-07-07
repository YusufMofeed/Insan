using Insan.Application.Interfaces;
using Insan.Domain.Entities;

namespace Insan.Application.Services;

public class VoiceService
{
    private readonly IVoiceRepository _voiceRepository;
    private readonly IJourneyRepository _journeyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserContext _userContext;

    public VoiceService(
        IVoiceRepository voiceRepository,
        IJourneyRepository journeyRepository,
        IUnitOfWork unitOfWork,
        IUserContext userContext)
    {
        _voiceRepository = voiceRepository;
        _journeyRepository = journeyRepository;
        _unitOfWork = unitOfWork;
        _userContext = userContext;
    }

    public async Task<Voice> CreateAsync(
        Guid journeyId,
        string authorName,
        string relationship,
        string content,
        CancellationToken cancellationToken = default)
    {
        if (!_userContext.IsAuthenticated)
            throw new UnauthorizedAccessException("User must be authenticated to submit a voice.");

        var journey = await _journeyRepository.GetByIdAsync(journeyId, cancellationToken)
            ?? throw new KeyNotFoundException($"Journey '{journeyId}' was not found.");

        var voice = new Voice(journey.Id, _userContext.UserId, authorName, relationship, content);

        await _voiceRepository.AddAsync(voice, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return voice;
    }

    public async Task<Voice> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _voiceRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Voice '{id}' was not found.");
    }

    public Task<IReadOnlyList<Voice>> GetByJourneyAsync(
        Guid journeyId,
        bool onlyApproved,
        CancellationToken cancellationToken = default)
        => _voiceRepository.GetByJourneyIdAsync(journeyId, onlyApproved, cancellationToken);

    public async Task ApproveAsync(Guid voiceId, CancellationToken cancellationToken = default)
    {
        var voice = await _voiceRepository.GetByIdAsync(voiceId, cancellationToken)
            ?? throw new KeyNotFoundException($"Voice '{voiceId}' was not found.");

        voice.Approve();

        await _voiceRepository.UpdateAsync(voice, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task RejectAsync(Guid voiceId, CancellationToken cancellationToken = default)
    {
        var voice = await _voiceRepository.GetByIdAsync(voiceId, cancellationToken)
            ?? throw new KeyNotFoundException($"Voice '{voiceId}' was not found.");

        voice.Reject();

        await _voiceRepository.UpdateAsync(voice, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
