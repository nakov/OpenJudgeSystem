namespace OJS.Services.Administration.Business.Implementations;

using FluentExtensions.Extensions;
using System.Linq;
using OJS.Services.Common.Data;
using SoftUni.Data.Infrastructure.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public class OrderableService<TEntity> : IOrderableService<TEntity>
    where TEntity : class, IOrderableEntity
{
    private readonly IDataService<TEntity> dataService;

    public OrderableService(IDataService<TEntity> dataService)
        => this.dataService = dataService;

    public async Task ReevaluateOrderBy(IEnumerable<TEntity> entities)
    {
        var orderByIndex = 0;

        entities
            .OrderBy(p => p.OrderBy)
            .ForEach(p =>
            {
                p.OrderBy = ++orderByIndex;
                this.dataService.Update(p);
            });

        await this.dataService.SaveChanges();
    }
}