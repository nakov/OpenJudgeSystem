namespace OJS.Services.Common.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Extensions;
    using OJS.Common.Utils;
    using OJS.Data;
    using OJS.Services.Common.Models.Users;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using OJS.Data.Models.Common;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class DataService<TEntity> : IDataService<TEntity>
        where TEntity : class, IEntity
    {
        private readonly OjsDbContext db;

        public DataService(OjsDbContext db)
        {
            this.db = db;
            this.IgnoreQueryFilters = false;
        }

        protected bool IgnoreQueryFilters { get; init; }

        public virtual async Task Add(TEntity entity)
            => await this.db.AddAsync(entity);

        public virtual async Task AddMany(IEnumerable<TEntity> entities)
            => await this.db.AddRangeAsync(entities);

        public virtual void Update(TEntity entity)
            => this.db.Update(entity);

        public virtual void Delete(TEntity entity)
            => this.db.Remove(entity);

        public void Delete(Expression<Func<TEntity, bool>>? filter = null)
            => this.db.RemoveRange(this.GetQuery(filter));

        public virtual async Task DeleteById(object id)
        {
            var entity = await this.OneById(id);
            this.Delete(entity!);
        }

        public void Detach(TEntity entity)
            => this.db.Entry(entity).State = EntityState.Detached;

        public virtual void DeleteMany(IEnumerable<TEntity> entities)
            => this.db.RemoveRange(entities);

        public virtual async Task<IEnumerable<TEntity>> All(
            Expression<Func<TEntity, bool>>? filter = null,
            Expression<Func<TEntity, object>>? orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
            => await this
                .GetQuery(filter, orderBy, descending, skip, take)
                .ToListAsync();

        public virtual async Task<IEnumerable<TResult>> AllTo<TResult>(
            Expression<Func<TEntity, bool>>? filter = null,
            Expression<Func<TEntity, object>>? orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
            where TResult : class
            => await this.GetQuery(filter, orderBy, descending, skip, take)
                .MapCollection<TResult>()
                .ToListAsync();

        public virtual async Task<TEntity?> OneById(object id)
            => await this.GetByIdQuery(id)
                .FirstOrDefaultAsync();

        public virtual async Task<TResult?> OneByIdTo<TResult>(object id)
           where TResult : class
           => await this.GetByIdQuery(id)
               .MapCollection<TResult>()
               .FirstOrDefaultAsync();

        public virtual async Task<TEntity?> One(Expression<Func<TEntity, bool>> filter)
            => await this
                .GetQuery(filter)
                .FirstOrDefaultAsync();

        public virtual async Task<TResult?> OneTo<TResult>(Expression<Func<TEntity, bool>> filter)
            where TResult : class
            => await this.GetQuery(filter)
                .MapCollection<TResult>()
                .FirstOrDefaultAsync();

        public virtual async Task<int> Count(Expression<Func<TEntity, bool>>? filter = null)
            => await this
                .GetQuery(filter)
                .CountAsync();

        public virtual async Task<bool> Exists(Expression<Func<TEntity, bool>>? filter = null)
            => await this
                .GetQuery(filter)
                .AnyAsync();

        public virtual async Task<bool> ExistsById(object id)
            => await this
                .GetByIdQuery(id)
                .AnyAsync();

        public virtual async Task SaveChanges()
            => await this.db.SaveChangesAsync();

        public virtual IQueryable<TEntity> GetByIdQuery(object id)
        {
            var filter = ExpressionBuilder.BuildEqualsFilter<TEntity>(id, nameof(IEntity<object>.Id));
            return this.GetQuery(filter);
        }

        public virtual IQueryable<TEntity> GetQuery(
            Expression<Func<TEntity, bool>>? filter = null,
            Expression<Func<TEntity, object>>? orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
        {
            var query = this.db.Set<TEntity>().AsQueryable();

            if (this.IgnoreQueryFilters)
            {
                query = query.IgnoreQueryFilters();
            }

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

        public IQueryable<TEntity> GetQueryForUser(
            UserInfoModel user,
            Expression<Func<TEntity, bool>>? filter = null,
            Expression<Func<TEntity, object>>? orderBy = null,
            bool descending = false,
            int? skip = null,
            int? take = null)
            => this.GetQuery(this.GetUserFilter(user).CombineAndAlso(filter), orderBy, descending, skip, take);

        //// In case that the timeout is set to 0, this means that there is no timeout.
        public async Task ExecuteSqlCommandWithTimeout(string query, int timeoutInSeconds)
        {
            var originalTimeout = this.db.Database.GetCommandTimeout();
            try
            {
                this.db.Database.SetCommandTimeout(timeoutInSeconds);
                await this.DbExecuteSqlCommand(query);
            }
            finally
            {
                this.db.Database.SetCommandTimeout(originalTimeout);
            }
        }

        protected virtual Expression<Func<TEntity, bool>> GetUserFilter(UserInfoModel user)
            => _ => true;

        private async Task DbExecuteSqlCommand(string query) =>
           await this.db.Database.ExecuteSqlRawAsync(query);
    }
}