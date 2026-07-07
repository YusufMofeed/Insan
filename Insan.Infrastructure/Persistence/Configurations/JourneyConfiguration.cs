using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Insan.Infrastructure.Persistence.Configurations;

public class JourneyConfiguration : IEntityTypeConfiguration<Journey>
{
    public void Configure(EntityTypeBuilder<Journey> builder)
    {
        builder.ToTable("Journeys");

        builder.HasKey(j => j.Id);

        builder.Property(j => j.FullName)
            .IsRequired();

        builder.Property(j => j.City)
            .IsRequired();

        builder.Property(j => j.Occupation)
            .IsRequired();

        builder.Property(j => j.Biography)
            .IsRequired();

        builder.Property(j => j.CreatedBy)
            .IsRequired();

        builder.Property(j => j.CreatedAt)
            .IsRequired();

        builder.Property(j => j.IsDeleted)
            .IsRequired();

        // Indexes per docs/08-database-design.md Indexing Strategy.
        builder.HasIndex(j => j.FullName);
        builder.HasIndex(j => j.City);
        builder.HasIndex(j => j.Occupation);

        // User (1) ---- (*) Journey. Restrict: deleting a User must not cascade-delete the Journeys they created.
        builder.HasOne(j => j.Creator)
            .WithMany(u => u.Journeys)
            .HasForeignKey(j => j.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        // Soft delete: exclude archived Journeys from all queries by default.
        builder.HasQueryFilter(j => !j.IsDeleted);
    }
}
