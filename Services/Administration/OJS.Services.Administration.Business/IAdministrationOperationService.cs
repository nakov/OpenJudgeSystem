namespace OJS.Services.Administration.Business;

using OJS.Data.Models.Common;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface IAdministrationOperationService<TEntity, in TId, TUpdateModel> : IService
    where TEntity : class, IEntity<TId>
{
    Task<TUpdateModel> Get(TId id);

    Task<TUpdateModel> Create(TUpdateModel model);

    Task<TUpdateModel> Edit(TUpdateModel model);

    Task Delete(TId id);
}