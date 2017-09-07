namespace OJS.Data.Repositories.Base
{
    using System.Collections.Generic;
    using Data.Contracts;
    using MongoDB.Bson;
    using MongoDB.Driver;

    public interface IMongoRepository<TEntity, TIdentifier>
        where TEntity : class, IEntity<TIdentifier>
    {
        IMongoDatabase Database { get; set; }

        IEnumerable<TEntity> GetAll();

        TEntity Find(FilterDefinition<TEntity> filter);
    }
}
