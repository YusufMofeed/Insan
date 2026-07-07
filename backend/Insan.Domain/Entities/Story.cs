using Insan.Domain.Common;

namespace Insan.Domain.Entities;

public class Story : BaseEntity
{
    public Guid JourneyId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public string AuthorName { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }

    private Story()
    {
    }

    public Story(Guid journeyId, string title, string content, string authorName)
    {
        if (journeyId == Guid.Empty)
            throw new ArgumentException("JourneyId is required.", nameof(journeyId));
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content is required.", nameof(content));
        if (string.IsNullOrWhiteSpace(authorName))
            throw new ArgumentException("AuthorName is required.", nameof(authorName));

        JourneyId = journeyId;
        Title = title;
        Content = content;
        AuthorName = authorName;
        CreatedAt = DateTime.UtcNow;
    }
}
