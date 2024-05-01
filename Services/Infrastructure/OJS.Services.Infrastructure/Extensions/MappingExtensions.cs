namespace OJS.Services.Infrastructure.Extensions;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public static class MappingExtensions
{
    public static TDestination Map<TDestination>(this object item)
        => AutoMapperSingleton.Instance.Mapper.Map<TDestination>(item);

    public static object Map(this object item, Type destinationType)
        => AutoMapperSingleton.Instance.Mapper.Map(item, item.GetType(), destinationType);

    public static IEnumerable<TDestination> MapAndWrapInCollection<TDestination>(this object item)
        => Enumerable.Repeat(AutoMapperSingleton.Instance.Mapper.Map<TDestination>(item), 1);

    public static TDestination MapFrom<TDestination>(this TDestination destination, object source)
        => AutoMapperSingleton.Instance.Mapper.Map(source, destination);

    public static IEnumerable<TDestination> MapCollection<TDestination>(this IEnumerable enumerable)
        => AutoMapperSingleton.Instance.Mapper.Map<IEnumerable<TDestination>>(enumerable);

    public static IQueryable<TDestination> MapCollection<TDestination>(
        this IQueryable queryable,
        object parameters = null!)
        => AutoMapperSingleton.Instance.Mapper.ProjectTo<TDestination>(queryable, parameters);

    public static async Task<TDestination> Map<TDestination>(this Task task)
        => AutoMapperSingleton.Instance.Mapper.Map<TDestination>(await (task as dynamic));

    public static async Task<IEnumerable<TDestination>> MapCollection<TDestination>(this Task task)
    {
        var taskWithResult = task as dynamic;

        if (!task.HasEnumerableResult())
        {
            var destination = AutoMapperSingleton.Instance.Mapper.Map<TDestination>(await taskWithResult);

            return new List<TDestination> { destination };
        }

        return AutoMapperSingleton.Instance.Mapper.Map<IEnumerable<TDestination>>(await taskWithResult);
    }

    private static bool HasEnumerableResult(this Task task)
    {
        var type = task.GetType();
        if (!type.IsGenericType)
        {
            throw new InvalidOperationException("Cannot map a void Task.");
        }

        var genericArguments = type.GetGenericArguments();

        return typeof(IEnumerable).IsAssignableFrom(genericArguments.First());
    }
}