namespace OJS.Data.Repositories.Base
{
    using System;
    using System.Collections.Generic;
 
    using Data.Contracts;
    using MongoDB.Bson;
    using MongoDB.Driver;

    public class GenericMongoRepository<TEntity, TIdentifier> : IMongoRepository<TEntity, TIdentifier>
        where TEntity : class, IEntity<TIdentifier>
    {
        public GenericMongoRepository(IMongoDatabase mongoDatabase)
        {
            if (mongoDatabase == null)
            {
                throw new ArgumentException("An instance of MongoDatabase is required to use this repository.", nameof(mongoDatabase));
            }

            this.Database = mongoDatabase;
        }

        public IMongoDatabase Database { get; set; }

        public TEntity Find(FilterDefinition<TEntity> filter)
        {
            var collection = this.Database.GetCollection<TEntity>(typeof(TEntity).Name);

            return collection.Find(filter).FirstOrDefault();
        }

        public IEnumerable<TEntity> GetAll()
        {
            return this.Database.GetCollection<TEntity>(typeof(TEntity).Name).Find(new BsonDocument()).ToList();
        }

        public IEnumerable<TEntity> FindAll(FilterDefinition<TEntity> filter)
        {
            var collection = this.Database.GetCollection<TEntity>(typeof(TEntity).Name);

            var listAsync = collection.Find(filter).ToList();

            return listAsync;
        }

        public void Delete(TEntity entity)
        {
            var collection = this.Database.GetCollection<TEntity>(typeof(TEntity).Name);

            collection.DeleteOneAsync(x => x.Id.Equals(entity.Id));
        }

    }
}
