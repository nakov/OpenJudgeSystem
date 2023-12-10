namespace OJS.Services.Infrastructure.Pagination;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using SoftUni.AutoMapper.Infrastructure.Extensions;

public class PaginationModel<TEntity> : SortingModel<TEntity>
{
    [Range(1, 100)]
    public int ItemsPerPage { get; set; }

    [Range(1, int.MaxValue)]
    public int Page { get; set; }

    public async Task<PaginatedList<T>> ApplyPagination<T>(IQueryable<TEntity> query)
    {
        query = this.ApplyFiltering(query);
        query = this.ApplySorting(query);

        var paginatedList = new PaginatedList<T>(this.Page, this.ItemsPerPage);

        paginatedList.TotalCount = await query.CountAsync();
        paginatedList.Items = await query
            .Skip((this.Page - 1) * this.ItemsPerPage)
            .Take(this.ItemsPerPage)
            .ToListAsync()
            .MapCollection<T>();

        return paginatedList;
    }
}