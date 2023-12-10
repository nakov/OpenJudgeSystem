namespace OJS.Services.Infrastructure.Pagination;

using System.Linq;
using System;
using System.Linq.Expressions;
using System.Reflection;

public class SortingModel<TEntity> : FilterModel<TEntity>
{
    public string? Sorting { get; set; }

    protected IQueryable<TEntity> ApplySorting(IQueryable<TEntity> query)
    {
        if (string.IsNullOrEmpty(this.Sorting))
        {
            return query;
        }

        var conditions = this.Sorting.Split(',', StringSplitOptions.RemoveEmptyEntries);

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

            return query.Provider.CreateQuery<TEntity>(BuildSortingExpression(query, sortingProperty, sortingType));
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