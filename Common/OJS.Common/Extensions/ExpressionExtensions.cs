namespace OJS.Common.Extensions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public static class ExpressionExtensions
{
    public static Expression<Func<T, bool>> CombineAndAlso<T>(
        this Expression<Func<T, bool>> a,
        Expression<Func<T, bool>>? b)
    {
        ParameterExpression parameter = Expression.Parameter(typeof(T));

        if (b == null)
        {
            return a;
        }

        var andAlso = Expression.AndAlso(
            Expression.Invoke(a, parameter),
            Expression.Invoke(b, parameter));

        var combinedExpression = Expression.Lambda<Func<T, bool>>(andAlso, parameter);

        return combinedExpression;
    }

    public static Expression<Func<T, bool>> CombineMultiple<T>(
        this ICollection<Expression<Func<T, bool>>> expressions)
    {
        if (expressions.Count == 0)
        {
            return ex => true;
        }

        Expression<Func<T, bool>> combinedFilterExpression = expressions
            .Aggregate((current, next) =>
                Expression.Lambda<Func<T, bool>>(
                    Expression.AndAlso(
                        current.Body,
                        Expression.Invoke(next, current.Parameters)),
                    current.Parameters));

        return combinedFilterExpression;
    }
}