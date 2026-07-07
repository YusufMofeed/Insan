using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Insan.Infrastructure.Persistence.Configurations;

public class StoryConfiguration : IEntityTypeConfiguration<Story>
{
    public void Configure(EntityTypeBuilder<Story> builder)
    {
        builder.ToTable("Stories");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Title)
            .IsRequired();

        builder.Property(s => s.Content)
            .IsRequired();

        builder.Property(s => s.AuthorName)
            .IsRequired();

        builder.Property(s => s.CreatedAt)
            .IsRequired();

        // Journey (1) ---- (*) Story. No navigation property on either side for this relationship
        // (consistent with the Voice/Memory <-> Journey relationships).
        // Cascade: Stories belong entirely to their Journey and must not be orphaned (BR-1, BR-11).
        builder.HasOne<Journey>()
            .WithMany()
            .HasForeignKey(s => s.JourneyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
