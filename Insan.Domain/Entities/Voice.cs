using Insan.Domain.Common;
using Insan.Domain.Enums;

namespace Insan.Domain.Entities;

public class Voice : BaseEntity
{
    public Guid JourneyId { get; private set; }
    public Guid UserId { get; private set; }
    public User? User { get; private set; }
    public string AuthorName { get; private set; } = string.Empty;
    public string Relationship { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public VoiceStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public bool IsDeleted { get; private set; }

    private Voice()
    {
    }

    public Voice(Guid journeyId, Guid userId, string authorName, string relationship, string content)
    {
        if (journeyId == Guid.Empty)
            throw new ArgumentException("JourneyId is required.", nameof(journeyId));
        if (userId == Guid.Empty)
            throw new ArgumentException("UserId is required.", nameof(userId));
        if (string.IsNullOrWhiteSpace(authorName))
            throw new ArgumentException("AuthorName is required.", nameof(authorName));
        if (string.IsNullOrWhiteSpace(relationship))
            throw new ArgumentException("Relationship is required.", nameof(relationship));
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content is required.", nameof(content));

        JourneyId = journeyId;
        UserId = userId;
        AuthorName = authorName;
        Relationship = relationship;
        Content = content;
        Status = VoiceStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    public void Approve()
    {
        if (Status != VoiceStatus.Pending)
            throw new InvalidOperationException("Only pending voices can be approved.");

        Status = VoiceStatus.Approved;
    }

    public void Reject()
    {
        if (Status != VoiceStatus.Pending)
            throw new InvalidOperationException("Only pending voices can be rejected.");

        Status = VoiceStatus.Rejected;
    }

    public void SoftDelete()
    {
        IsDeleted = true;
    }
}
