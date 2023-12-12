namespace OJS.Services.Common.Data.Pagination;

using Microsoft.EntityFrameworkCore;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;
using SoftUni.Data.Infrastructure.Models;
using OJS.Services.Common.Models.Pagination;

public abstract class GridDataService<TEntity> : SortingService<TEntity>
    where TEntity : class, IEntity
{
    private readonly IDataService<TEntity> dataService;

    public GridDataService(IDataService<TEntity> dataService) => this.dataService = dataService;

    public async Task<PaginatedList<T>> GetAll<T>(PaginationRequestModel paginationRequestModel)
    {
        var query = this.dataService.GetQuery();
        query = this.ApplyFiltering<T>(query, paginationRequestModel.Filter);
        query = this.ApplySorting(query, paginationRequestModel.Sorting);

        var response = await this.ApplyPagination<T>(
            query,
            paginationRequestModel.Page,
            paginationRequestModel.ItemsPerPage);
        return response;
    }

    protected virtual async Task<PaginatedList<T>> ApplyPagination<T>(IQueryable<TEntity> query, int page, int itemsPerPage)
    {
        var paginatedList = new PaginatedList<T>(page, itemsPerPage);

        paginatedList.TotalCount = await query.CountAsync();
        paginatedList.Items = await query
            .Skip((page - 1) * itemsPerPage)
            .Take(itemsPerPage)
            .MapCollection<T>()
            .ToListAsync();

        return paginatedList;
    }
}