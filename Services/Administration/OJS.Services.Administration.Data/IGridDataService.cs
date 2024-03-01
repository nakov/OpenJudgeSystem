namespace OJS.Services.Administration.Data;

using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Models.Users;
using SoftUni.Common.Models;
using System;
using System.Linq.Expressions;
using SoftUni.Services.Infrastructure;
using SoftUni.Data.Infrastructure.Models;
using System.Threading.Tasks;

public interface IGridDataService<TEntity> : IService
    where TEntity : class, IEntity
{
    Task<bool> UserHasAccessToGrid(UserInfoModel user);

    Task<PagedResult<TModel>> GetAll<TModel>(
        PaginationRequestModel paginationRequestModel,
        Expression<Func<TEntity, bool>>? filter = null,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descendingOrder = false);

    Task<PagedResult<TModel>> GetAllForUser<TModel>(
        PaginationRequestModel paginationRequestModel,
        UserInfoModel user,
        Expression<Func<TEntity, bool>>? filter = null);
}
