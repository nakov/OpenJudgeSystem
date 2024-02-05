namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;

public interface IPermissionsService<TModel> : IService
where TModel : class
{
   bool HasReadPermission();

   bool HasCreatePermission();

   bool HasUpdatePermission(TModel model);

   bool HasDeletePermission(int id);
}