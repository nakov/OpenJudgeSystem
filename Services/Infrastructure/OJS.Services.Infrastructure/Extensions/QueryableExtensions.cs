namespace OJS.Services.Infrastructure.Extensions
{
    using Microsoft.EntityFrameworkCore;
    using SoftUni.Common.Models;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    public static class QueryableExtensions
    {
        public static async Task<IEnumerable<T>> ToEnumerableAsync<T>(this IQueryable<T> queryable)
            => await queryable
                .ToListAsync();

        public static async Task<PagedResult<T>> ToPagedResult<T>(this IQueryable<T> queryable, int page, int itemsPerPage)
            => new()
            {
                PageNumber = page,
                ItemsPerPage = itemsPerPage,
                TotalItemsCount = await queryable.CountAsync(),
                Items = await queryable
                    .Skip((page - 1) * itemsPerPage)
                    .Take(itemsPerPage)
                    .ToListAsync(),
            };
    }
}
