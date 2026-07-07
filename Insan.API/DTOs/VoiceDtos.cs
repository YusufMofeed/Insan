using Insan.Domain.Entities;

namespace Insan.API.DTOs;

public class CreateVoiceRequest
{
    public Guid JourneyId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class VoiceResponse
{
    public Guid Id { get; set; }
    public Guid JourneyId { get; set; }
    public Guid UserId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public static VoiceResponse FromEntity(Voice voice) => new()
    {
        Id = voice.Id,
        JourneyId = voice.JourneyId,
        UserId = voice.UserId,
        AuthorName = voice.AuthorName,
        Relationship = voice.Relationship,
        Content = voice.Content,
        Status = voice.Status.ToString(),
        CreatedAt = voice.CreatedAt
    };
}
