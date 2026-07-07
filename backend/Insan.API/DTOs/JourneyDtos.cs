using Insan.Domain.Entities;

namespace Insan.API.DTOs;

public class CreateJourneyRequest
{
    public string FullName { get; set; } = string.Empty;
    public string? Nickname { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime? MartyrdomDate { get; set; }
    public string City { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string Biography { get; set; } = string.Empty;

    // Temporary: docs/09-api-specification.md's documented request body has no createdBy field
    // (it's expected to come from the authenticated user's JWT claims). Auth isn't wired up yet,
    // so it's accepted here until that phase.
    public Guid CreatedBy { get; set; }
}

public class UpdateJourneyRequest
{
    public string FullName { get; set; } = string.Empty;
    public string? Nickname { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime? MartyrdomDate { get; set; }
    public string City { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string Biography { get; set; } = string.Empty;
}

public class JourneyResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Nickname { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime? MartyrdomDate { get; set; }
    public string City { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string Biography { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public static JourneyResponse FromEntity(Journey journey) => new()
    {
        Id = journey.Id,
        FullName = journey.FullName,
        Nickname = journey.Nickname,
        BirthDate = journey.BirthDate,
        MartyrdomDate = journey.MartyrdomDate,
        City = journey.City,
        Occupation = journey.Occupation,
        Biography = journey.Biography,
        CreatedAt = journey.CreatedAt,
        UpdatedAt = journey.UpdatedAt
    };
}
