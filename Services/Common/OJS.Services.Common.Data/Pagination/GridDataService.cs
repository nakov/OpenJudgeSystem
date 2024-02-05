namespace OJS.Services.Common.Data.Pagination;

using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using SoftUni.Data.Infrastructure.Models;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Data.Pagination.Enums;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using SoftUni.Common.Models;

public class GridDataService<TEntity> : IGridDataService<TEntity>
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

    public async Task<PagedResult<T>> GetAll<T>(PaginationRequestModel paginationRequestModel, Expression<Func<TEntity, bool>>? filter = null)
    {
        var query = this.dataService.GetQuery(filter);

        return await this.ApplyAll<T>(paginationRequestModel, query);
    }

    protected virtual async Task<PagedResult<T>> ApplyPagination<T>(IQueryable<T> query, int page, int itemsPerPage)
    {
        var paginatedList = new PagedResult<T>();

        paginatedList.PageNumber = page;
        paginatedList.ItemsPerPage = itemsPerPage;
        paginatedList.TotalItemsCount = await query.CountAsync();
        paginatedList.Items = await query
            .Skip((page - 1) * itemsPerPage)
            .Take(itemsPerPage)
            .ToListAsync();

        return paginatedList;
    }

    private IEnumerable<FilteringModel> MapFilterStringToCollection<T>(PaginationRequestModel paginationRequestModel)
    {
        var filteringCollection = new List<FilteringModel>();
        if (string.IsNullOrEmpty(paginationRequestModel.Filter))
        {
            return filteringCollection;
        }

        var conditions = paginationRequestModel.Filter!.Split('&', StringSplitOptions.RemoveEmptyEntries);

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

            var filteringProperty = this.filteringService.GetProperty<T>(key);

            if (filteringProperty is null)
            {
                    throw new ArgumentNullException($"Property with name {key} is not found.");
            }

            filteringCollection.Add(new FilteringModel(filteringProperty, operatorType, value));
        }

        return filteringCollection;
    }

    private async Task<PagedResult<T>> ApplyAll<T>(PaginationRequestModel paginationRequestModel, IQueryable<TEntity> query)
    {
        var filterAsCollection = this.MapFilterStringToCollection<T>(paginationRequestModel).ToList();

        var mappedQuery = this.filteringService.ApplyFiltering<TEntity, T>(query, filterAsCollection);
        mappedQuery = this.sortingService.ApplySorting(mappedQuery, paginationRequestModel.Sorting);

        var response = await this.ApplyPagination<T>(
                mappedQuery,
                paginationRequestModel.Page,
                paginationRequestModel.ItemsPerPage);
        return response;
    }
}