using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Insan.Infrastructure.Persistence.Configurations;

public class VoiceConfiguration : IEntityTypeConfiguration<Voice>
{
    public void Configure(EntityTypeBuilder<Voice> builder)
    {
        builder.ToTable("Voices");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.AuthorName)
            .IsRequired();

        builder.Property(v => v.Relationship)
            .IsRequired();

        builder.Property(v => v.Content)
            .IsRequired();

        builder.Property(v => v.Status)
            .IsRequired();

        builder.Property(v => v.CreatedAt)
            .IsRequired();

        builder.Property(v => v.IsDeleted)
            .IsRequired();

        // Index per docs/08-database-design.md Indexing Strategy.
        builder.HasIndex(v => v.Status);

        // User (1) ---- (*) Voice. Restrict: deleting a User must not cascade-delete their authored Voices (historical integrity).
        builder.HasOne(v => v.User)
            .WithMany(u => u.Voices)
            .HasForeignKey(v => v.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Journey (1) ---- (*) Voice. No navigation property on either side for this relationship.
        // Cascade: Voices belong entirely to their Journey and must not be orphaned (BR-1, BR-11).
        builder.HasOne<Journey>()
            .WithMany()
            .HasForeignKey(v => v.JourneyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
