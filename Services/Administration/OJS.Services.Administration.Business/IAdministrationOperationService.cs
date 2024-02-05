namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IAdministrationOperationService<TEntity, TUpdateModel> : IService
{
    Task<TUpdateModel> Get(int id);

    Task<TUpdateModel> Create(TUpdateModel model);

    Task<TUpdateModel> Edit(TUpdateModel model);

    Task Delete(int id);
}