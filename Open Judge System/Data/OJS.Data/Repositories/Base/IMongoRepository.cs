namespace OJS.Data.Repositories.Base
{
    using System.Collections.Generic;

    using MongoDB.Driver;

    using OJS.Data.Contracts;

    public interface IMongoRepository<TEntity, TIdentifier>
        where TEntity : class, IMongoEntity<TIdentifier>
    {
        IMongoDatabase Database { get; set; }

        IEnumerable<TEntity> GetAll();

        TEntity Find(FilterDefinition<TEntity> filter);
    }
}
