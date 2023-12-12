namespace OJS.Services.Common.Data.Pagination;

using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

public abstract class SortingService<TEntity> : FilteringService<TEntity>
{
    protected virtual IQueryable<TEntity> ApplySorting(IQueryable<TEntity> query, string? sorting)
    {
        if (string.IsNullOrEmpty(sorting))
        {
            return query;
        }

        var conditions = sorting.Split(',', StringSplitOptions.RemoveEmptyEntries);

        foreach (var condition in conditions)
        {
            var sortingParts = condition.Split(new[] { '=' }, StringSplitOptions.RemoveEmptyEntries);
            if (sortingParts.Length != 2)
            {
                throw new ArgumentOutOfRangeException($"Sorting {condition} must contain key, operator and value");
            }

            var key = sortingParts[0].Trim();
            var sortingType = sortingParts[1].Trim();

            var sortingProperty = GetEntityProperty(key);

            if (sortingProperty is null)
            {
                return query;
            }
            else
            {
                return query.Provider.CreateQuery<TEntity>(BuildSortingExpression(query, sortingProperty, sortingType));
            }
        }

        return query;
    }

    private static MethodCallExpression BuildSortingExpression(
        IQueryable<TEntity> query,
        PropertyInfo sortingProperty,
        string sortingType)
    {
        var parameter = Expression.Parameter(typeof(TEntity), "x");
        var property = Expression.Property(parameter, sortingProperty);
        var lambda = Expression.Lambda(property, parameter);

        string methodName;

        if (string.Equals(sortingType, "ASC", StringComparison.OrdinalIgnoreCase))
        {
            methodName = "OrderBy";
        }
        else if (string.Equals(sortingType, "DESC", StringComparison.OrdinalIgnoreCase))
        {
            methodName = "OrderByDescending";
        }
        else
        {
            throw new ArgumentException("Invalid sort direction");
        }

        return Expression.Call(
            typeof(Queryable),
            methodName,
            new Type[] { typeof(TEntity), property.Type },
            query.Expression,
            lambda);
    }
}