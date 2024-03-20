namespace OJS.Services.Administration.Business;

using SoftUni.Data.Infrastructure.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IAdministrationOperationService<TEntity, in TId, TUpdateModel> : IService
    where TEntity : class
{
    Task<TUpdateModel> Get(TId id);

    Task<TUpdateModel> Create(TUpdateModel model);

    Task<TUpdateModel> Edit(TUpdateModel model);

    Task Delete(TId id);
}