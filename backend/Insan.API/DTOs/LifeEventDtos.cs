using Insan.Domain.Entities;

namespace Insan.API.DTOs;

public class CreateLifeEventRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int DisplayOrder { get; set; }
    public string? ImageUrl { get; set; }
}

public class UpdateLifeEventRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int DisplayOrder { get; set; }
    public string? ImageUrl { get; set; }
}

public class LifeEventResponse
{
    public Guid Id { get; set; }
    public Guid JourneyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int DisplayOrder { get; set; }
    public string? ImageUrl { get; set; }

    public static LifeEventResponse FromEntity(LifeEvent lifeEvent) => new()
    {
        Id = lifeEvent.Id,
        JourneyId = lifeEvent.JourneyId,
        Title = lifeEvent.Title,
        Description = lifeEvent.Description,
        EventDate = lifeEvent.EventDate,
        DisplayOrder = lifeEvent.DisplayOrder,
        ImageUrl = lifeEvent.ImageUrl
    };
}
