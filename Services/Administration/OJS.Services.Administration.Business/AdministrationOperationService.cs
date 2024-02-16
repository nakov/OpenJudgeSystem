namespace OJS.Services.Administration.Business;

using SoftUni.Data.Infrastructure.Models;
using System.Threading.Tasks;

public abstract class AdministrationOperationService<TEntity, TId, TUpdateModel>
    : IAdministrationOperationService<TEntity, TId, TUpdateModel>
    where TEntity : class, IEntity<TId>
{
    public virtual Task<TUpdateModel> Get(TId id) => throw new System.NotImplementedException();

    public virtual Task<TUpdateModel> Create(TUpdateModel model) => throw new System.NotImplementedException();

    public virtual Task<TUpdateModel> Edit(TUpdateModel model) => throw new System.NotImplementedException();

    public virtual Task Delete(TId id) => throw new System.NotImplementedException();
}