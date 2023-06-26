namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IOrderableService<TEntity> : IService

{
    Task ReevaluateOrderBy(IEnumerable<TEntity> entities);
}