namespace OJS.Services.Common.Data;

using OJS.Data.Models.Common;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

public interface ISeederDataService<TEntity> : IDataService<TEntity>
    where TEntity : class, IEntity
{
    Task CreateIfNotExists<TModel>(
        TEntity entity,
        TModel model,
        Func<string, Expression<Func<TEntity, bool>>> filter,
        Func<TModel, string> getIdentifier);
}