namespace OJS.Services.Administration.Data.Implementations;

using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;
using System.Linq;
using SoftUni.Data.Infrastructure.Models;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Data.Pagination.Enums;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

public class GridDataService<TEntity>
    : IGridDataService<TEntity>
    where TEntity : class, IEntity
{
    private readonly IDataService<TEntity> dataService;
    private readonly ISortingService sortingService;
    private readonly IFilteringService filteringService;

    public GridDataService(
        IDataService<TEntity> dataService,
        ISortingService sortingService,
        IFilteringService filteringService)
    {
        this.dataService = dataService;
        this.sortingService = sortingService;
        this.filteringService = filteringService;
    }

    // TODO: Mark entities with attributes that are not allowed for lecturers
    // and use reflection to filter out the grids for the current user.
    public Task<bool> UserHasAccessToGrid(UserInfoModel user) => Task.FromResult(true);

    public virtual Task<PagedResult<TModel>> GetAll<TModel>(
        PaginationRequestModel paginationRequestModel,
        Expression<Func<TEntity, bool>>? filter = null)
        => this.GetPagedResultFromQuery<TModel>(paginationRequestModel, this.dataService.GetQuery(filter));

    public virtual Task<PagedResult<TModel>> GetAllForUser<TModel>(
        PaginationRequestModel paginationRequestModel,
        UserInfoModel user,
        Expression<Func<TEntity, bool>>? filter = null)
        => this.GetPagedResultFromQuery<TModel>(paginationRequestModel, this.dataService.GetQueryForUser(user, filter));

    private static IEnumerable<FilteringModel> MapFilterStringToCollection<T>(PaginationRequestModel paginationRequestModel)
    {
        var filteringCollection = new List<FilteringModel>();
        if (string.IsNullOrEmpty(paginationRequestModel.Filter))
        {
            return filteringCollection;
        }

        var conditions = paginationRequestModel.Filter!.Split("&;", StringSplitOptions.RemoveEmptyEntries);

        foreach (var condition in conditions)
        {
            var filterParts = condition.Split('~', StringSplitOptions.RemoveEmptyEntries);
            if (filterParts.Length != 3)
            {
                throw new ArgumentOutOfRangeException($"Filter {condition} must contain key, operator and value");
            }

            var key = filterParts[0];
            var operatorTypeAsString = filterParts[1];
            var value = filterParts[2];

            var isParsed = Enum.TryParse(operatorTypeAsString, true, out OperatorType operatorType);

            if (!isParsed)
            {
                throw new ArgumentException($"Operator with type {operatorTypeAsString} is not supported.");
            }

            var filteringProperty = PropertyInfoCache.GetPropertyInfo<T>(key);

            filteringCollection.Add(new FilteringModel(filteringProperty, operatorType, value));
        }

        return filteringCollection;
    }

    private async Task<PagedResult<TModel>> GetPagedResultFromQuery<TModel>(PaginationRequestModel paginationRequestModel, IQueryable<TEntity> query)
    {
        var filterAsCollection = MapFilterStringToCollection<TModel>(paginationRequestModel).ToList();

        var mappedQuery = this.filteringService.ApplyFiltering<TEntity, TModel>(query.AsNoTracking(), filterAsCollection);
        return await this.sortingService
            .ApplySorting(mappedQuery, paginationRequestModel.Sorting)
            .ToPagedResult(paginationRequestModel.Page, paginationRequestModel.ItemsPerPage);
    }
}