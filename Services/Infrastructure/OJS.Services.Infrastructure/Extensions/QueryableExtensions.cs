namespace OJS.Services.Infrastructure.Extensions;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public static class QueryableExtensions
{
    public static async Task<IEnumerable<T>> ToEnumerableAsync<T>(this IQueryable<T> queryable)
        => await queryable
            .ToListAsync();

    public static PagedResult<T> ToPagedResult<T>(
        this IQueryable<T> queryable,
        int? itemsPerPage,
        int? pageNumber)
    {
        var page = queryable.ToPagedResultInternal(itemsPerPage, pageNumber);

        page.Items = queryable
            .GetItemsPageQuery(itemsPerPage!.Value, pageNumber!.Value)
            .ToList();

        return page;
    }

    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
        this IQueryable<T> queryable,
        int? itemsPerPage,
        int? pageNumber)
    {
        var page = queryable.ToPagedResultInternal(itemsPerPage, pageNumber);

        page.Items = await queryable
            .GetItemsPageQuery(itemsPerPage!.Value, pageNumber!.Value)
            .ToListAsync();

        return page;
    }

    private static PagedResult<T> ToPagedResultInternal<T>(
        this IQueryable<T> queryable,
        int? itemsPerPage,
        int? pageNumber)
    {
        if (itemsPerPage <= 0 || pageNumber <= 0)
        {
            var parameterName = itemsPerPage <= 0 ? nameof(itemsPerPage) : nameof(pageNumber);
            throw new ArgumentException("Value cannot be less than or equal to zero", parameterName);
        }

        var totalItemsCount = queryable.Count();
        itemsPerPage ??= totalItemsCount;
        pageNumber ??= 1;

        var pagesCount = CalculatePagesCount(totalItemsCount, itemsPerPage.Value);

        return new PagedResult<T>
        {
            TotalItemsCount = totalItemsCount,
            ItemsPerPage = itemsPerPage.Value,
            PagesCount = pagesCount,
            PageNumber = pageNumber.Value,
        };
    }

    private static int CalculatePagesCount(int totalItemsCount, int itemsPerPage)
        => totalItemsCount > itemsPerPage
            ? (int)Math.Ceiling((double)totalItemsCount / itemsPerPage)
            : 1;

    private static IQueryable<T> GetItemsPageQuery<T>(this IQueryable<T> queryable, int itemsPerPage, int pageNumber)
        => queryable
            .Skip(itemsPerPage * (pageNumber - 1))
            .Take(itemsPerPage);
}
