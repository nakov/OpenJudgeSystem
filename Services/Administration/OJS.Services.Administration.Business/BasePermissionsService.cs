namespace OJS.Services.Administration.Business;

public abstract class BasePermissionService<TModel>
where TModel : class
{
    public virtual bool HasReadPermission() => true;

    public virtual bool HasCreatePermission() => true;

    public virtual bool HasUpdatePermission(TModel model) => true;

    public virtual bool HasDeletePermission(int id) => true;
}