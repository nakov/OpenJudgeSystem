namespace OJS.Services.Administration.Business;
using System.Threading.Tasks;

public abstract class AdministrationOperationService<TEntity, TUpdateModel>
{
    public virtual Task<TUpdateModel> Get(int id) => throw new System.NotImplementedException();

    public virtual Task<TUpdateModel> Create(TUpdateModel model) => throw new System.NotImplementedException();

    public virtual Task<TUpdateModel> Edit(TUpdateModel model) => throw new System.NotImplementedException();

    public virtual Task Delete(int id) => throw new System.NotImplementedException();
}