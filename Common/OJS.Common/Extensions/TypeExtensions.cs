namespace OJS.Common.Extensions;

using System;
using System.Linq;

public static class TypeExtensions
{
    public static bool IsAssignableToGenericType(this Type givenType, Type genericType)
    {
        var interfaceTypes = givenType.GetInterfaces();

        if (interfaceTypes.Any(it => it.IsGenericType && it.GetGenericTypeDefinition() == genericType))
        {
            return true;
        }

        if (givenType.IsGenericType && givenType.GetGenericTypeDefinition() == genericType)
        {
            return true;
        }

        var baseType = givenType.BaseType;
        return baseType != null && IsAssignableToGenericType(baseType, genericType);
    }

    public static Type? GetGenericInterfaceType(this Type type, Type genericInterfaceType)
    {
        if (type is { IsInterface: true, IsGenericType: true } &&
            type.GetGenericTypeDefinition() == genericInterfaceType)
        {
            return type;
        }

        return type
            .GetInterfaces()
            .FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == genericInterfaceType);
    }

    public static string GetAssemblyPrefix(this Type type)
    {
        if (type == null)
        {
            throw new ArgumentNullException(nameof(type), "Could not load project name. Type is not provided.");
        }

        return type.Assembly.GetPrefix();
    }

    public static bool IsOpenGenericType(this Type type)
        => type is { IsGenericType: true, ContainsGenericParameters: true };
}