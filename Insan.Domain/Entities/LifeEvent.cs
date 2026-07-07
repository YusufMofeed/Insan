using Insan.Domain.Common;

namespace Insan.Domain.Entities;

public class LifeEvent : BaseEntity
{
    public Guid JourneyId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public DateTime EventDate { get; private set; }
    public string? ImageUrl { get; private set; }
    public int DisplayOrder { get; private set; }

    private LifeEvent()
    {
    }

    public LifeEvent(
        Guid journeyId,
        string title,
        string description,
        DateTime eventDate,
        int displayOrder,
        string? imageUrl = null)
    {
        if (journeyId == Guid.Empty)
            throw new ArgumentException("JourneyId is required.", nameof(journeyId));
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description is required.", nameof(description));

        JourneyId = journeyId;
        Title = title;
        Description = description;
        EventDate = eventDate;
        DisplayOrder = displayOrder;
        ImageUrl = imageUrl;
    }

    public void UpdateDetails(
        string title,
        string description,
        DateTime eventDate,
        int displayOrder,
        string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description is required.", nameof(description));

        Title = title;
        Description = description;
        EventDate = eventDate;
        DisplayOrder = displayOrder;
        ImageUrl = imageUrl;
    }
}
