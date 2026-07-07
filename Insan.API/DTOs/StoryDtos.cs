using Insan.Domain.Entities;

namespace Insan.API.DTOs;

public class CreateStoryRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
}

public class StoryResponse
{
    public Guid Id { get; set; }
    public Guid JourneyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public static StoryResponse FromEntity(Story story) => new()
    {
        Id = story.Id,
        JourneyId = story.JourneyId,
        Title = story.Title,
        Content = story.Content,
        AuthorName = story.AuthorName,
        CreatedAt = story.CreatedAt
    };
}
