namespace OJS.Servers.Administration.Infrastructure.Extensions;

using System.Linq.Expressions;

public static class ExpressionExtensions
{
    public static Expression<Func<T, bool>> CombineOrElse<T>(
        this Expression<Func<T, bool>> a,
        Expression<Func<T, bool>>? b)
    {
        ParameterExpression parameter = Expression.Parameter(typeof(T));

        if (b == null)
        {
            return a;
        }

        var orElse = Expression.OrElse(
            Expression.Invoke(a, parameter),
            Expression.Invoke(b, parameter));

        var combinedExpression = Expression.Lambda<Func<T, bool>>(orElse, parameter);

        return combinedExpression;
    }
}