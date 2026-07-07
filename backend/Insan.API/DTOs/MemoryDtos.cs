using Insan.Domain.Entities;

namespace Insan.API.DTOs;

public class CreateMemoryRequest
{
    public string Url { get; set; } = string.Empty;
    public string Caption { get; set; } = string.Empty;
}

public class MemoryResponse
{
    public Guid Id { get; set; }
    public Guid JourneyId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Caption { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }

    public static MemoryResponse FromEntity(Memory memory) => new()
    {
        Id = memory.Id,
        JourneyId = memory.JourneyId,
        Url = memory.Url,
        Type = memory.Type.ToString(),
        Caption = memory.Caption,
        UploadedAt = memory.UploadedAt
    };
}
