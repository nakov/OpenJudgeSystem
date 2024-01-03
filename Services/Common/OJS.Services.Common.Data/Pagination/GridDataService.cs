namespace OJS.Services.Common.Data.Pagination;

using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using SoftUni.Data.Infrastructure.Models;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Data.Pagination.Enums;
using System;
using System.Collections.Generic;

public abstract class GridDataService<TEntity> : SortingService<TEntity>
    where TEntity : class, IEntity
{
    private readonly IDataService<TEntity> dataService;

    public GridDataService(IDataService<TEntity> dataService) => this.dataService = dataService;

    public async Task<PaginatedList<T>> GetAll<T>(PaginationRequestModel paginationRequestModel)
    {
        var query = this.dataService.GetQuery();

        var filterAsCollection = MapFilterStringToCollection<T>(paginationRequestModel).ToList();

        var mappedQuery = this.ApplyFiltering<T>(query, filterAsCollection);
        mappedQuery = this.ApplySorting(mappedQuery, paginationRequestModel.Sorting);

        var response = await this.ApplyPagination<T>(
            mappedQuery,
            paginationRequestModel.Page,
            paginationRequestModel.ItemsPerPage);
        return response;
    }

    protected virtual async Task<PaginatedList<T>> ApplyPagination<T>(IQueryable<T> query, int page, int itemsPerPage)
    {
        var paginatedList = new PaginatedList<T>(page, itemsPerPage);

        paginatedList.TotalCount = await query.CountAsync();
        paginatedList.Items = await query
            .Skip((page - 1) * itemsPerPage)
            .Take(itemsPerPage)
            .ToListAsync();

        return paginatedList;
    }

    private static IEnumerable<FilteringModel> MapFilterStringToCollection<T>(PaginationRequestModel paginationRequestModel)
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

            var filteringProperty = GetProperty<T>(key);

            if (filteringProperty is null)
            {
                    throw new ArgumentNullException($"Property with name {key} is not found.");
            }

            filteringCollection.Add(new FilteringModel(filteringProperty, operatorType, value));
        }

        return filteringCollection;
    }
}