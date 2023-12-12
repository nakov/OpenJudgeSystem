namespace OJS.Services.Common.Data.Pagination;

using OJS.Services.Common.Data.Pagination.Enums;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

public abstract class FilteringService<TEntity>
{
    protected static PropertyInfo? GetEntityProperty(string key)
    {
        var propertyInfo = typeof(TEntity).GetProperties()
            .FirstOrDefault(p =>
                string.Equals(p.Name, key, StringComparison.OrdinalIgnoreCase));

        if (propertyInfo is null)
        {
            return null;
        }

        return propertyInfo;
    }

    protected virtual IQueryable<TEntity> ApplyFiltering<TModel>(IQueryable<TEntity> query, string? filter)
    {
        if (string.IsNullOrEmpty(filter))
        {
            return query;
        }

        var conditions = filter.Split(',', StringSplitOptions.RemoveEmptyEntries);

        foreach (var condition in conditions)
        {
            var filterParts = condition.Split(new[] { '=', ' ' }, StringSplitOptions.RemoveEmptyEntries);
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

            var filteringProperty = GetEntityProperty(key);
            if (filteringProperty is null)
            {
                filteringProperty = GetModelProperty(key);
            }

            if (filteringProperty is null)
            {
                throw new ArgumentNullException($"Property with name {key} is not found.");
            }

            var expression = BuildFilteringExpression(query, filteringProperty, operatorType, value);
            query = query.Where(expression);
        }

        return query;
    }

    private static PropertyInfo? GetModelProperty(string key)
    {
        var propertyInfo = typeof(TEntity).GetProperties()
            .FirstOrDefault(p =>
                string.Equals(p.Name, key, StringComparison.OrdinalIgnoreCase));

        if (propertyInfo is null)
        {
            return null;
        }

        return propertyInfo;
    }

    private static Expression<Func<TEntity, bool>> BuildFilteringExpression(IQueryable<TEntity> query, PropertyInfo filteringProperty, OperatorType operatorType, string value)
    {
        var parameter = Expression.Parameter(typeof(TEntity), "x");
        var property = Expression.Property(parameter, filteringProperty);

        Expression? expression = null;
        if (filteringProperty.PropertyType == typeof(string))
        {
            expression = BuildStringExpression(operatorType, value, property);
        }
        else if (filteringProperty.PropertyType == typeof(bool))
        {
            expression = BuildBooleanExpression(operatorType, value, property);
        }
        else if (filteringProperty.PropertyType == typeof(int) ||
                 Nullable.GetUnderlyingType(filteringProperty.PropertyType) == typeof(int))
        {
            expression = BuildIntExpression(operatorType, value, property);
        }

        if (expression == null)
        {
            throw new InvalidOperationException("Expression cannot be build");
        }

        return Expression.Lambda<Func<TEntity, bool>>(expression, parameter);
    }

    private static Expression? BuildIntExpression(OperatorType operatorType, string? value, MemberExpression property)
    {
        Expression? expression;

        if (value == null || value.Equals("null", StringComparison.OrdinalIgnoreCase))
        {
            if (!IsNullableType(property.Type))
            {
                throw new ArgumentException($"Cannot assign null to a non-nullable integer property: {property.Member.Name}");
            }

            switch (operatorType)
            {
                case OperatorType.Equals:
                    expression = Expression.Equal(property, Expression.Constant(null, property.Type));
                    break;
                case OperatorType.NotEquals:
                    expression = Expression.NotEqual(property, Expression.Constant(null, property.Type));
                    break;
                default:
                    throw new ArgumentOutOfRangeException(
                        $"Property of type int? cannot have {operatorType} operator");
            }
        }
        else if (int.TryParse(value, out var intValue))
        {
            var constant = Expression.Constant(intValue, IsNullableType(property.Type) ? typeof(int?) : typeof(int));
            switch (operatorType)
            {
                case OperatorType.Equals:
                    expression = Expression.Equal(property, constant);
                    break;
                case OperatorType.GreaterThan:
                    expression = Expression.GreaterThan(property, constant);
                    break;
                case OperatorType.LessThan:
                    expression = Expression.LessThan(property, constant);
                    break;
                case OperatorType.LessThanOrEqual:
                    expression = Expression.LessThanOrEqual(property, constant);
                    break;
                case OperatorType.GreaterThanOrEqual:
                    expression = Expression.GreaterThanOrEqual(property, constant);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(
                        $"Property of type int cannot have {operatorType} operator");
            }
        }
        else
        {
            throw new ArgumentException($"Invalid value for integer property: {value}");
        }

        return expression;
    }

    private static Expression? BuildBooleanExpression(OperatorType operatorType, string value, MemberExpression property)
    {
        Expression? expression;
        if (!bool.TryParse(value, out var boolValue))
        {
            throw new ArgumentException($"Invalid value for boolean property: {value}");
        }

        var constant = Expression.Constant(boolValue);
        switch (operatorType)
        {
            case OperatorType.Equals:
                expression = Expression.Equal(property, constant);
                break;
            default:
                throw new ArgumentOutOfRangeException(
                    $"Property of type bool cannot have {operatorType} operator");
        }

        return expression;
    }

    private static Expression? BuildStringExpression(OperatorType operatorType, string value, MemberExpression property)
    {
        Expression? expression;
        var constant = Expression.Constant(value, typeof(string));
        switch (operatorType)
        {
            case OperatorType.Equals:
                expression = Expression.Equal(property, constant);
                break;
            case OperatorType.Contains:
                expression = Expression.Call(
                    property,
                    typeof(string).GetMethod("Contains", new[] { typeof(string) }) !,
                    constant);
                break;
            case OperatorType.StartsWith:
                expression = Expression.Call(
                    property,
                    typeof(string).GetMethod("StartsWith", new[] { typeof(string) }) !,
                    constant);
                break;
            case OperatorType.EndsWith:
                expression = Expression.Call(
                    property,
                    typeof(string).GetMethod("EndsWith", new[] { typeof(string) }) !,
                    constant);
                break;
            default:
                throw new ArgumentOutOfRangeException(
                    $"Property of type string: cannot have {operatorType} operator");
        }

        return expression;
    }

    private static bool IsNullableType(Type type)
        => Nullable.GetUnderlyingType(type) != null || !type.IsValueType;
}