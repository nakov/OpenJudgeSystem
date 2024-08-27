namespace OJS.Common.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    public static class ExpressionBuilder
    {
        public static Expression<Func<TElement, bool>> BuildEqualsFilter<TElement>(object value, string propertyName)
        {
            var parameterExpression = Expression.Parameter(typeof(TElement));

            var leftArgument = Expression.PropertyOrField(parameterExpression, propertyName);
            var rightArgument = Expression.Constant(value);
            var equalsExpression = Expression.Equal(leftArgument, rightArgument);

            return Expression.Lambda<Func<TElement, bool>>(equalsExpression, parameterExpression);
        }

        public static Expression<Func<TElement, bool>> BuildOrExpression<TElement, TValue>(
            IEnumerable<TValue> values,
            Expression<Func<TElement, TValue>> valueSelector)
        {
            ArgumentNullException.ThrowIfNull(valueSelector);
            ArgumentNullException.ThrowIfNull(values);

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
}