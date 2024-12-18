namespace OJS.Services.Common.Data.Implementations;

using Microsoft.Extensions.Logging;
using OJS.Data;
using OJS.Data.Models.Common;
using OJS.Services.Infrastructure.Constants;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

public class SeederDataService<TEntity>(
    ILogger<SeederDataService<TEntity>> logger,
    OjsDbContext db)
    : DataService<TEntity>(db), ISeederDataService<TEntity>
    where TEntity : class, IEntity
{
    public async Task CreateIfNotExists<TModel>(
        TEntity entity,
        TModel model,
        Func<string, Expression<Func<TEntity, bool>>> filter,
        Func<TModel, string> getIdentifier)
    {
        var identifier = getIdentifier(model);

        if (await this.Exists(filter(identifier)))
        {
            logger.LogSettingExistsSkipAdding(identifier);
            return;
        }

        await this.Add(entity);
        await this.SaveChanges();
        logger.LogAddedSetting(identifier);
    }
}
