namespace OJS.Data.Repositories.Base
{
    using System;
    using System.Collections.Generic;

    using Data.Contracts;
    using MongoDB.Bson;
    using MongoDB.Driver;

    public class GenericMongoRepository<TMongoEntity, TIdentifier> : IMongoRepository<TMongoEntity, TIdentifier>
        where TMongoEntity : class, IMongoEntity<TIdentifier>
    {
        public GenericMongoRepository(IMongoDatabase mongoDatabase)
        {
            this.Database = mongoDatabase
                ?? throw new ArgumentException(
                    "An instance of MongoDatabase is required to use this repository.",
                    nameof(mongoDatabase));
        }

        public IMongoDatabase Database { get; set; }

        public TMongoEntity Find(FilterDefinition<TMongoEntity> filter)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            return collection.Find(filter).FirstOrDefault();
        }

        public IEnumerable<TMongoEntity> GetAll()
        {
            return this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name).Find(new BsonDocument()).ToList();
        }

        public IEnumerable<TMongoEntity> FindAll(FilterDefinition<TMongoEntity> filter)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            var listAsync = collection.Find(filter).ToList();

            return listAsync;
        }

        public void Delete(TMongoEntity entity)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            collection.DeleteOneAsync(x => x.Id.Equals(entity.Id));
        }

    }
}
