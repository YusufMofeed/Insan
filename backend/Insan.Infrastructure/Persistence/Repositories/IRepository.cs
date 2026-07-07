using Insan.Domain.Common;

namespace Insan.Infrastructure.Persistence.Repositories;

public interface IRepository<T> where T : BaseEntity
{
    Task AddAsync(T entity, CancellationToken cancellationToken = default);

    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);

    void Update(T entity);
}
