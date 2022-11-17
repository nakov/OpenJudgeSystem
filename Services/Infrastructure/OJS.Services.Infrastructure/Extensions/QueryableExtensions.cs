namespace OJS.Services.Infrastructure.Extensions
{
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    public static class QueryableExtensions
    {
        public static async Task<IEnumerable<T>> ToEnumerableAsync<T>(this IQueryable<T> queryable)
            => await queryable
                .ToListAsync();
    }
}
