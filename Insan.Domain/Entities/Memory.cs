using Insan.Domain.Common;
using Insan.Domain.Enums;

namespace Insan.Domain.Entities;

public class Memory : BaseEntity
{
    public Guid JourneyId { get; private set; }
    public string Url { get; private set; } = string.Empty;
    public MemoryType Type { get; private set; }
    public string Caption { get; private set; } = string.Empty;
    public DateTime UploadedAt { get; private set; }

    private Memory()
    {
    }

    public Memory(Guid journeyId, string url, string caption)
    {
        if (journeyId == Guid.Empty)
            throw new ArgumentException("JourneyId is required.", nameof(journeyId));
        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("Url is required.", nameof(url));
        if (string.IsNullOrWhiteSpace(caption))
            throw new ArgumentException("Caption is required.", nameof(caption));

        JourneyId = journeyId;
        Url = url;
        Caption = caption;
        Type = MemoryType.Image;
        UploadedAt = DateTime.UtcNow;
    }
}
