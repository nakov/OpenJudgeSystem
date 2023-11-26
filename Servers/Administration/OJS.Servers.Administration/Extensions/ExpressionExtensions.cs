namespace OJS.Servers.Administration.Extensions;

using System;
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
}