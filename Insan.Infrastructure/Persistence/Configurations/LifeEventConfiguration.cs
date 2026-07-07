using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Insan.Infrastructure.Persistence.Configurations;

public class LifeEventConfiguration : IEntityTypeConfiguration<LifeEvent>
{
    public void Configure(EntityTypeBuilder<LifeEvent> builder)
    {
        builder.ToTable("LifeEvents");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Title)
            .IsRequired();

        builder.Property(l => l.Description)
            .IsRequired();

        builder.Property(l => l.EventDate)
            .IsRequired();

        builder.Property(l => l.DisplayOrder)
            .IsRequired();

        // ImageUrl is optional per docs/08-database-design.md - no IsRequired() call.

        // Index per docs/08-database-design.md Indexing Strategy.
        builder.HasIndex(l => l.EventDate);

        // Journey (1) ---- (*) LifeEvent. No navigation property on either side for this relationship
        // (consistent with the Voice/Memory/Story <-> Journey relationships).
        // Cascade: LifeEvents belong entirely to their Journey and must not be orphaned (BR-1, BR-11).
        builder.HasOne<Journey>()
            .WithMany()
            .HasForeignKey(l => l.JourneyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
