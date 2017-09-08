namespace OJS.Data.Repositories.Base
{
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using MongoDB.Driver;
    using MongoDB.Driver.Linq;
    using OJS.Data.Contracts;

    public interface IMongoRepository<TMongoEntity, TIdentifier>
        where TMongoEntity : class, IMongoEntity<TIdentifier>
    {
        IMongoDatabase Database { get; set; }

        IMongoQueryable<TMongoEntity> All();

        TMongoEntity GetById(TIdentifier id);

        void Add(TMongoEntity entity);

        void Add(IEnumerable<TMongoEntity> entities);

        void Update(TMongoEntity entity);

        void Update(
            Expression<Func<TMongoEntity, bool>> filterExpression,
            UpdateDefinition<TMongoEntity> updateExpression);

        void Delete(TIdentifier id);

        void Delete(TMongoEntity entity);

        void Delete(Expression<Func<TMongoEntity, bool>> filterExpression);
    }
}
