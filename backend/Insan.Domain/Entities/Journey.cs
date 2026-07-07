using Insan.Domain.Common;

namespace Insan.Domain.Entities;

public class Journey : BaseEntity
{
    public string FullName { get; private set; } = string.Empty;
    public string? Nickname { get; private set; }
    public DateTime? BirthDate { get; private set; }
    public DateTime? MartyrdomDate { get; private set; }
    public string City { get; private set; } = string.Empty;
    public string Occupation { get; private set; } = string.Empty;
    public string Biography { get; private set; } = string.Empty;
    public Guid CreatedBy { get; private set; }
    public User? Creator { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public bool IsDeleted { get; private set; }

    private Journey()
    {
    }

    public Journey(
        string fullName,
        string city,
        string occupation,
        string biography,
        Guid createdBy,
        string? nickname = null,
        DateTime? birthDate = null,
        DateTime? martyrdomDate = null)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("FullName is required.", nameof(fullName));
        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentException("City is required.", nameof(city));
        if (string.IsNullOrWhiteSpace(occupation))
            throw new ArgumentException("Occupation is required.", nameof(occupation));
        if (string.IsNullOrWhiteSpace(biography))
            throw new ArgumentException("Biography is required.", nameof(biography));
        if (createdBy == Guid.Empty)
            throw new ArgumentException("CreatedBy is required.", nameof(createdBy));

        FullName = fullName;
        City = city;
        Occupation = occupation;
        Biography = biography;
        CreatedBy = createdBy;
        Nickname = nickname;
        BirthDate = birthDate;
        MartyrdomDate = martyrdomDate;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateDetails(
        string fullName,
        string city,
        string occupation,
        string biography,
        string? nickname = null,
        DateTime? birthDate = null,
        DateTime? martyrdomDate = null)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("FullName is required.", nameof(fullName));
        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentException("City is required.", nameof(city));
        if (string.IsNullOrWhiteSpace(occupation))
            throw new ArgumentException("Occupation is required.", nameof(occupation));
        if (string.IsNullOrWhiteSpace(biography))
            throw new ArgumentException("Biography is required.", nameof(biography));

        FullName = fullName;
        City = city;
        Occupation = occupation;
        Biography = biography;
        Nickname = nickname;
        BirthDate = birthDate;
        MartyrdomDate = martyrdomDate;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        IsDeleted = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
