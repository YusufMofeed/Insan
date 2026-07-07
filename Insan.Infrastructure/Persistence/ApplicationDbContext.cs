using Insan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insan.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Journey> Journeys => Set<Journey>();
    public DbSet<Voice> Voices => Set<Voice>();
    public DbSet<Memory> Memories => Set<Memory>();
    public DbSet<Story> Stories => Set<Story>();
    public DbSet<LifeEvent> LifeEvents => Set<LifeEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
