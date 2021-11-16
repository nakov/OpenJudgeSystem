namespace OJS.Services.Common.Data.Infrastructure.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Utils;
    using OJS.Data.Infrastructure.Models;
    using OJS.Services.Infrastructure.Mapping;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class DataService<TEntity> : IDataService<TEntity>
        where TEntity : class, IEntity
    {
        private readonly DbContext db;

        public DataService(DbContext db)
            => this.db = db;

        protected DbSet<TEntity> DbSet
            => this.db.Set<TEntity>();

        public virtual async Task Add(TEntity entity)
            => await this.db.AddAsync(entity);

        public virtual async Task AddMany(IEnumerable<TEntity> entities)
            => await this.db.AddRangeAsync(entities);

        public virtual void Update(TEntity entity)
            => this.db.Update(entity);

        public virtual void Delete(TEntity entity)
            => this.db.Remove(entity);

        public virtual async Task DeleteById(object id)
        {
            var entity = await this.DbSet.FindAsync(id);

            this.Delete(entity);
        }

        public virtual void DeleteMany(IEnumerable<TEntity> entities)
            => this.db.RemoveRange(entities);

        public virtual async Task<IEnumerable<TEntity>> All(
            Expression<Func<TEntity, bool>> filter = null,
            Expression<Func<TEntity, object>> orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
            => await this
                .GetQuery(filter, orderBy, descending, skip, take)
                .ToListAsync();

        public virtual async Task<IEnumerable<TResult>> AllTo<TResult>(
            Expression<Func<TEntity, bool>> filter = null,
            Expression<Func<TEntity, object>> orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
            where TResult : class
            => await this.GetQuery(filter, orderBy, descending, skip, take)
                .MapCollection<TResult>()
                .ToListAsync();

        public virtual async Task<TEntity> OneById(object id)
            => await this.GetByIdQuery(id)
                .FirstOrDefaultAsync();

        public virtual async Task<TResult> OneByIdTo<TResult>(object id)
           where TResult : class
           => await this.GetByIdQuery(id)
               .MapCollection<TResult>()
               .FirstOrDefaultAsync();

        public virtual async Task<TEntity> One(Expression<Func<TEntity, bool>> filter)
            => await this
                .GetQuery(filter)
                .FirstOrDefaultAsync();

        public virtual async Task<TResult> OneTo<TResult>(Expression<Func<TEntity, bool>> filter)
            where TResult : class
            => await this.GetQuery(filter)
                .MapCollection<TResult>()
                .FirstOrDefaultAsync();

        public virtual async Task<int> Count(Expression<Func<TEntity, bool>> filter = null)
            => await this
                .GetQuery(filter)
                .CountAsync();

        public virtual async Task<bool> Exists(Expression<Func<TEntity, bool>> filter = null)
            => await this
                .GetQuery(filter)
                .AnyAsync();

        public virtual async Task SaveChanges()
            => await this.db.SaveChangesAsync();

        protected IQueryable<TEntity> GetByIdQuery(object id)
        {
            var filter = ExpressionBuilder.BuildEqualsFilter<TEntity>(id, nameof(IEntity<object>.Id));
            return this.DbSet.Where(filter);
        }

        protected virtual IQueryable<TEntity> GetQuery(
            Expression<Func<TEntity, bool>> filter = null,
            Expression<Func<TEntity, object>> orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
        {
            var query = this.DbSet.AsQueryable();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (orderBy != null)
            {
                query = descending
                    ? query.OrderByDescending(orderBy)
                    : query.OrderBy(orderBy);
            }

            if (skip.HasValue)
            {
                query = query.Skip(skip.Value);
            }

            if (take.HasValue)
            {
                query = query.Take(take.Value);
            }

            return query;
        }
    }
}