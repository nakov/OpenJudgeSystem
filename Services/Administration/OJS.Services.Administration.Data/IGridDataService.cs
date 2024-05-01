namespace OJS.Services.Administration.Data;

using OJS.Services.Common.Models.Files;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Models;
using OJS.Data.Models.Common;
using OJS.Services.Infrastructure;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

public interface IGridDataService<TEntity> : IService
    where TEntity : class, IEntity
{
    Task<bool> UserHasAccessToGrid(UserInfoModel user);

    Task<PagedResult<TModel>> GetAll<TModel>(
        PaginationRequestModel paginationRequestModel,
        Expression<Func<TEntity, bool>>? filter = null);

    Task<PagedResult<TModel>> GetAll<TModel>(
        PaginationRequestModel paginationRequestModel,
        Expression<Func<TEntity, object>> orderBy,
        Expression<Func<TEntity, bool>>? filter = null,
        bool descendingOrder = false);

    Task<PagedResult<TModel>> GetAllForUser<TModel>(
        PaginationRequestModel paginationRequestModel,
        UserInfoModel user,
        Expression<Func<TEntity, bool>>? filter = null);

    Task<FileResponseModel> GetExcelResults<TModel>(
        PaginationRequestModel paginationRequestModel,
        Expression<Func<TEntity, bool>>? filter = null);

    Task<FileResponseModel> GetExcelResults<TModel>(
        PaginationRequestModel paginationRequestModel,
        Expression<Func<TEntity, object>> orderBy,
        Expression<Func<TEntity, bool>>? filter = null,
        bool descendingOrder = false);

    Task<FileResponseModel> GetExcelResultsForUser<TModel>(
        PaginationRequestModel paginationRequestModel,
        UserInfoModel user,
        Expression<Func<TEntity, bool>>? filter = null);
}
