namespace OJS.Services.Administration.Business;

using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IOrderableService<TEntity> : IService
{
    Task ReevaluateOrder(IEnumerable<TEntity> entities);
}