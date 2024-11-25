namespace OJS.Services.Common;

using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using OJS.Data.Models.Common;
using OJS.Services.Common.Data;

public interface ISeederDataService<TEntity> : IDataService<TEntity>
    where TEntity : class, IEntity
{
    Task CreateIfNotExists<TModel>(
        TEntity entity,
        TModel model,
        Func<string, Expression<Func<TEntity, bool>>> filter,
        Func<TModel, string> getIdentifier);
}