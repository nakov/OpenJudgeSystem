﻿namespace OJS.Services.Common.Data.Pagination;

using OJS.Services.Common.Data.Pagination.Enums;
using System;
using System.Linq;
using System.Linq.Expressions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Services.Common.Models.Pagination;
using System.Collections.Generic;

public class FilteringService : IFilteringService
{
    public virtual IQueryable<TModel> ApplyFiltering<TEntity, TModel>(IQueryable<TEntity> query, List<FilteringModel> filters)
    {
        if (!filters.Any())
        {
            return query.MapCollection<TModel>();
        }

        var mappedQuery = query.MapCollection<TModel>();

        foreach (var filter in filters)
        {
            var expression = BuildFilteringExpression<TModel>(filter);
            mappedQuery = mappedQuery.Where(expression);
        }

        return mappedQuery;
    }

    private static Expression<Func<T, bool>> BuildFilteringExpression<T>(FilteringModel filter)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, filter.Property);

        Expression? expression = null;
        if (filter.Property.PropertyType == typeof(string))
        {
            expression = BuildStringExpression(filter.OperatorType, filter.Value, property);
        }
        else if (filter.Property.PropertyType == typeof(bool))
        {
            expression = BuildBooleanExpression(filter.OperatorType, filter.Value, property);
        }
        else if (filter.Property.PropertyType == typeof(int) ||
                 Nullable.GetUnderlyingType(filter.Property.PropertyType) == typeof(int) ||
                 filter.Property.PropertyType == typeof(double) ||
                 Nullable.GetUnderlyingType(filter.Property.PropertyType) == typeof(double))
        {
            var propertyType = filter.Property.PropertyType;
            expression = BuildIntExpression(filter.OperatorType, filter.Value, property, propertyType);
        }
        else if (filter.Property.PropertyType == typeof(DateTime) ||
                 Nullable.GetUnderlyingType(filter.Property.PropertyType) == typeof(DateTime))
        {
            expression = BuildDateTimeExpression(filter.OperatorType, filter.Value, property);
        }

        if (expression == null)
        {
            throw new InvalidOperationException("Expression cannot be build");
        }

        return Expression.Lambda<Func<T, bool>>(expression, parameter);
    }

    private static Expression? BuildIntExpression(OperatorType operatorType, string? value, MemberExpression property, Type? propertyType)
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
        else if (int.TryParse(value, out var intValue) && propertyType == typeof(int))
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
        else if (double.TryParse(value, out var doubleValue) && propertyType == typeof(double))
        {
            var constant = Expression.Constant(doubleValue, IsNullableType(property.Type) ? typeof(double?) : typeof(double));
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

    private static Expression? BuildDateTimeExpression(OperatorType operatorType, string? value, MemberExpression property)
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
        else if (DateTime.TryParse(value, out var dateTimeValue))
        {
            var constant = Expression.Constant(dateTimeValue, IsNullableType(property.Type) ? typeof(DateTime?) : typeof(DateTime));
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
                    typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                    constant);
                break;
            case OperatorType.StartsWith:
                expression = Expression.Call(
                    property,
                    typeof(string).GetMethod("StartsWith", new[] { typeof(string) })!,
                    constant);
                break;
            case OperatorType.EndsWith:
                expression = Expression.Call(
                    property,
                    typeof(string).GetMethod("EndsWith", new[] { typeof(string) })!,
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