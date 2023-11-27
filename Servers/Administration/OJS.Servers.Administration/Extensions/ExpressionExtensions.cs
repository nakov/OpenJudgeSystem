namespace OJS.Servers.Administration.Extensions;

using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public static class ExpressionExtensions
{
    public static Expression<Func<T, bool>> CombineMultiple<T>(
        this ICollection<Expression<Func<T, bool>>> expressions)
    {
        if (!expressions.Any())
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