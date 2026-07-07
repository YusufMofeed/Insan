using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Insan.Infrastructure.Persistence.Configurations;

public class MemoryConfiguration : IEntityTypeConfiguration<Memory>
{
    public void Configure(EntityTypeBuilder<Memory> builder)
    {
        builder.ToTable("Memories");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Url)
            .IsRequired();

        builder.Property(m => m.Type)
            .IsRequired();

        builder.Property(m => m.Caption)
            .IsRequired();

        builder.Property(m => m.UploadedAt)
            .IsRequired();

        // Journey (1) ---- (*) Memory. No navigation property on either side for this relationship
        // (consistent with the Voice <-> Journey relationship).
        // Cascade: Memories belong entirely to their Journey and must not be orphaned (BR-1, BR-11).
        builder.HasOne<Journey>()
            .WithMany()
            .HasForeignKey(m => m.JourneyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
