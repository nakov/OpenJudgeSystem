namespace OJS.Services.Common.Data.Pagination;

using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using SoftUni.Data.Infrastructure.Models;

public class SortingService : ISortingService
{
    private readonly IFilteringService filteringService;

    public SortingService(IFilteringService filteringService)
        => this.filteringService = filteringService;

    public virtual IQueryable<TModel> ApplySorting<TModel>(IQueryable<TModel> query, string? sorting)
    {
        if (string.IsNullOrEmpty(sorting))
        {
            return query;
        }

        var sortingList = sorting.Split("&").ToList();
        int index = 0;
        foreach (var sort in sortingList)
        {
            var sortArgs = sort.Split("=");
            var key = sortArgs[0];
            var sortingDirection = sortArgs[1];

            var sortingProperty = this.filteringService.GetProperty<TModel>(key);

            if (sortingProperty is null)
            {
                continue;
            }

            var methodName = index == 0
                ? (sortingDirection == "ASC"
                    ? "OrderBy" : "OrderByDescending")
                :
                (sortingDirection == "ASC"
                    ? "ThenBy"
                    : "ThenByDescending");

            var expression = BuildSortingExpression(query, sortingProperty, methodName);
            query = query.Provider.CreateQuery<TModel>(expression);
            index += 1;
        }

        return query;
    }

    private static MethodCallExpression BuildSortingExpression<TModel>(
        IQueryable<TModel> query,
        PropertyInfo sortingProperty,
        string methodName)
    {
        var parameter = Expression.Parameter(typeof(TModel), "x");
        var property = Expression.Property(parameter, sortingProperty);
        var lambda = Expression.Lambda(property, parameter);

        return Expression.Call(
            typeof(Queryable),
            methodName,
            new Type[] { typeof(TModel), property.Type },
            query.Expression,
            Expression.Quote(lambda));
    }
}