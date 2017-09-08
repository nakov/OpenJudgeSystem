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
        public GenericMongoRepository(IMongoDatabase mongoDatabase)
        {
            if (mongoDatabase == null)
            {
                throw new ArgumentException(
                    "An instance of MongoDatabase is required to use this repository.", 
                    nameof(mongoDatabase));
            }

            this.Database = mongoDatabase;
        }

        public IMongoDatabase Database { get; set; }

        public IMongoQueryable<TMongoEntity> GetAll()
        {
            return this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name).AsQueryable();
        }

        public TMongoEntity GetById(TIdentifier id)
        {
            return this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name)
                .Find(x => x.Id.Equals(id))
                .FirstOrDefault();
        }

        public void Add(TMongoEntity entity)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);
            collection.InsertOne(entity);
        }

        public void Add(IEnumerable<TMongoEntity> entities)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);
            collection.InsertMany(entities);         
        }

        public void Update(TMongoEntity entity)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);
            collection.ReplaceOne(e => e.Id.Equals(entity.Id), entity, new UpdateOptions
            {
                IsUpsert = true
            });
        }

        public void Update(
            Expression<Func<TMongoEntity, bool>> filterExpression, 
            UpdateDefinition<TMongoEntity> updateExpression)
        {
            this.Database
                .GetCollection<TMongoEntity>(typeof(TMongoEntity).Name)
                .UpdateMany(filterExpression, updateExpression, new UpdateOptions
                {
                    IsUpsert = true
                });
        }

        public void Delete(TIdentifier id)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            collection.DeleteOne(x => x.Id.Equals(id));
        }

        public void Delete(TMongoEntity entity)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            collection.DeleteOne(x => x.Id.Equals(entity.Id));
        }

        public void Delete(Expression<Func<TMongoEntity, bool>> filterExpression)
        {
            var collection = this.Database.GetCollection<TMongoEntity>(typeof(TMongoEntity).Name);

            collection.DeleteMany(filterExpression);
        }
    }
}
