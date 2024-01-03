namespace OJS.Services.Common.Data.Pagination;

using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Collections.Generic;

public abstract class SortingService<TEntity> : FilteringService<TEntity>
{
    protected virtual IQueryable<TModel> ApplySorting<TModel>(IQueryable<TModel> query, string? sorting, string? directions)
    {
        if (string.IsNullOrEmpty(sorting) || string.IsNullOrEmpty(directions))
        {
            return query;
        }

        var sortingList = sorting.Split(" ").ToList();
        var directionsList = directions.Split(" ").ToList();
        if (sortingList.Count != directionsList.Count)
        {
            throw new ArgumentOutOfRangeException($"Exception throw in {nameof(this.ApplySorting)}: All sorting conditions must have direction");
        }

        for (int i = 0; i < sortingList.Count; i++)
        {
            var key = sortingList[i];
            var sortingDirection = directionsList[i];

            var sortingProperty = GetProperty<TModel>(key);

            if (sortingProperty is null)
            {
                continue;
            }

            var methodName = i == 0
                ? (sortingDirection == "ASC"
                    ? "OrderBy" : "OrderByDescending")
                :
                (sortingDirection == "ASC"
                    ? "ThenBy"
                    : "ThenByDescending");

            var expression = BuildSortingExpression(query, sortingProperty, methodName);
            query = query.Provider.CreateQuery<TModel>(expression);
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