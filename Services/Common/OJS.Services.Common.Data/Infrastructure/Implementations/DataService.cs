namespace OJS.Services.Common.Data.Infrastructure.Implementations
{
    using Microsoft.EntityFrameworkCore;
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
        private readonly IMapperService mapper;

        public DataService(DbContext dbContext, IMapperService mapper)
        {
            this.mapper = mapper;
            this.DbContext = dbContext;
        }

        private DbContext DbContext { get; }

        private DbSet<TEntity> DbSet
            => this.DbContext.Set<TEntity>();

        public virtual void Add(TEntity entity)
            => this.DbContext.Add(entity);

        public virtual void AddMany(IEnumerable<TEntity> entities)
            => this.DbContext.AddRange(entities);

        public virtual void Update(TEntity entity)
            => this.DbContext.Update(entity);

        public virtual void Delete(TEntity entity)
            => this.DbContext.Remove(entity);

        public virtual void DeleteMany(IEnumerable<TEntity> entities)
            => this.DbContext.RemoveRange(entities);

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
            => await this.mapper
                .ProjectTo<TResult>(this.GetQuery(filter, orderBy, descending, skip, take))
                .ToListAsync();

        public virtual async Task<TEntity> OneById(object id)
            => await this.DbContext.FindAsync<TEntity>(id);

        public virtual async Task<TResult> OneByIdTo<TResult>(object id)
           where TResult : class
           => await this.mapper
               .ProjectTo<TResult>(
                   this.DbSet
                       .Where(x => x is IEntity<int>
                           ? ((IEntity<int>)x).Id == (int)id
                           : ((IEntity<string>)x).Id == (string)id))
               .FirstOrDefaultAsync();

        public virtual async Task<TEntity> One(Expression<Func<TEntity, bool>> filter)
            => await this
                .GetQuery(filter)
                .FirstOrDefaultAsync();

        public virtual async Task<TResult> OneTo<TResult>(Expression<Func<TEntity, bool>> filter)
            where TResult : class
            => await this.mapper
                .ProjectTo<TResult>(this.GetQuery(filter))
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
            => await this.DbContext.SaveChangesAsync();

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