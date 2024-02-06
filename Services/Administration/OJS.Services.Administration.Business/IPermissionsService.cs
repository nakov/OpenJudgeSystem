namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Security.Claims;
using System;
using System.Linq.Expressions;

public interface IPermissionsService<TEntity, TModel> : IService
where TModel : class
{
   bool HasReadPermission();

   bool HasCreatePermission();

   bool HasUpdatePermission(TModel model);

   bool HasDeletePermission(int id);

   bool HasFullAccess(ClaimsPrincipal user);

   Expression<Func<TEntity, bool>>? GeneratePermittedRecordsExpression();
}