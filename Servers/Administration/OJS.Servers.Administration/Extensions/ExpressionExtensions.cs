namespace OJS.Servers.Administration.Extensions;

using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Linq;

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

    public static Expression<Func<TElement, bool>> BuildOrExpression<TElement, TValue>(
        IEnumerable<TValue> values,
        Expression<Func<TElement, TValue>> valueSelector)
    {
        if (valueSelector == null)
        {
            throw new ArgumentNullException(nameof(valueSelector));
        }

        if (values == null)
        {
            throw new ArgumentNullException(nameof(values));
        }

        var parameterExpression = valueSelector.Parameters.Single();

        if (!values.Any())
        {
            return e => false;
        }

        var equals =
            values.Select(
                value =>
                    (Expression)Expression.Equal(valueSelector.Body, Expression.Constant(value, typeof(TValue))));

        var body = equals.Aggregate(Expression.Or);

        return Expression.Lambda<Func<TElement, bool>>(body, parameterExpression);
    }
}