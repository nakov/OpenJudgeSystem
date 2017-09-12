namespace OJS.Data.Repositories.Base
{
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;

    using MongoDB.Driver;
    using MongoDB.Driver.Linq;

    using OJS.Data.Contracts;

    public class GenericMongoRepository<TMongoEntity, TIdentifier> : IMongoRepository<TMongoEntity, TIdentifier>
        where TMongoEntity : class, IMongoEntity<TIdentifier>
    {

        private readonly IMongoDatabase database;

        public GenericMongoRepository(IMongoDatabase mongoDatabase)
        {
            if (mongoDatabase == null)
            {
                throw new ArgumentException(
                    "An instance of MongoDatabase is required to use this repository.", 
                    nameof(mongoDatabase));
            }

            this.database = mongoDatabase;
        }

        public IMongoDatabase Database => this.database;

        public IMongoQueryable<TMongoEntity> All()
        {
            return this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name).AsQueryable();
        }

        public TMongoEntity GetById(TIdentifier id)
        {
            return this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name)
                .Find(x => x.Id.Equals(id))
                .FirstOrDefault();
        }

        public void Add(TMongoEntity entity)
        {
            var collection = this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);
            collection.InsertOne(entity);
        }

        public void Add(IEnumerable<TMongoEntity> entities)
        {
            var collection = this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);
            collection.InsertMany(entities);         
        }

        public void Update(TMongoEntity entity)
        {
            var collection = this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);
            collection.ReplaceOne(e => e.Id.Equals(entity.Id), entity, new UpdateOptions
            {
                IsUpsert = true
            });
        }

        public void Update(
            Expression<Func<TMongoEntity, bool>> filterExpression, 
            UpdateDefinition<TMongoEntity> updateExpression)
        {
            this.database
                .GetCollection<TMongoEntity>(typeof(TMongoEntity).Name)
                .UpdateMany(filterExpression, updateExpression, new UpdateOptions
                {
                    IsUpsert = true
                });
        }

        public void Delete(TIdentifier id)
        {
            var collection = this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            collection.DeleteOne(x => x.Id.Equals(id));
        }

        public void Delete(TMongoEntity entity)
        {
            var collection = this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            var idFilter = Builders<TMongoEntity>.Filter.Eq("_id", entity.Id);
            collection.DeleteOne(idFilter);
        }

        public void Delete(Expression<Func<TMongoEntity, bool>> filterExpression)
        {
            var collection = this.database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            collection.DeleteMany(filterExpression);
        }
    }
}
