namespace OJS.Services.Common.Data.Infrastructure
{
    using OJS.Data.Infrastructure.Models;
    using OJS.Services.Infrastructure;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public interface IDataService<TEntity> : IService
        where TEntity : class, IEntity
    {
        Task Add(TEntity entity);

        Task AddMany(IEnumerable<TEntity> entities);

        void Update(TEntity entity);

        void Delete(TEntity entity);

        Task DeleteById(object id);

        void DeleteMany(IEnumerable<TEntity> entities);

        Task<IEnumerable<TEntity>> All(
            Expression<Func<TEntity, bool>> filter = null,
            Expression<Func<TEntity, object>> orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null);

        Task<IEnumerable<TResult>> AllTo<TResult>(
            Expression<Func<TEntity, bool>> filter = null,
            Expression<Func<TEntity, object>> orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
            where TResult : class;

        Task<TEntity> OneById(object id);

        Task<TResult> OneByIdTo<TResult>(object id)
            where TResult : class;

        Task<TEntity> One(Expression<Func<TEntity, bool>> filter);

        Task<TResult> OneTo<TResult>(Expression<Func<TEntity, bool>> filter)
            where TResult : class;

        Task<int> Count(Expression<Func<TEntity, bool>> filter = null);

        Task<bool> Exists(Expression<Func<TEntity, bool>> filter = null);

        Task SaveChanges();

        // Temporary for easier migration of services from old to new judge
        IQueryable<TEntity> GetByIdQuery(object id);
    }
}