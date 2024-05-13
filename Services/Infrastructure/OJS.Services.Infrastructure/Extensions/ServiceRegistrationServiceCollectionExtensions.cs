namespace OJS.Services.Infrastructure.Extensions;

using FluentExtensions.Extensions;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using static OJS.Common.GlobalConstants.Assemblies;

public static class ServiceRegistrationServiceCollectionExtensions
{
    private static readonly Type ServiceType = typeof(IService);
    private static readonly Type ScopedServiceType = typeof(IScopedService);
    private static readonly Type SingletonServiceType = typeof(ISingletonService);

    public static IServiceCollection AddConventionServices<TProgram>(this IServiceCollection services)
            => services.AddConventionServices(typeof(TProgram));

    public static IServiceCollection AddConventionServices(this IServiceCollection services, Type programType)
    {
        var assemblyPrefix = programType.GetAssemblyPrefix();

        var businessServicesRegexPattern = string.Format(BusinessServicesRegexPatternTemplate, assemblyPrefix);
        var dataServicesRegexPattern = string.Format(DataServicesRegexPatternTemplate, assemblyPrefix);
        var commonServicesRegexPattern = string.Format(CommonServicesRegexPatternTemplate, assemblyPrefix);
        var infrastructureServicesRegexPattern = string.Format(InfrastructureServicesRegexPatternTemplate, assemblyPrefix);

        var serviceAssemblies = programType.Assembly
            .GetAllReferencedAssembliesWhereFullNameMatchesPatterns(
                businessServicesRegexPattern,
                dataServicesRegexPattern,
                commonServicesRegexPattern,
                infrastructureServicesRegexPattern)
            .ToArray();

        return services.AddFrom(serviceAssemblies);
    }

    public static IServiceCollection AddFrom(
        this IServiceCollection services,
        params Assembly[] assemblies)
    {
        assemblies
            .SelectMany(a => a.ExportedTypes)
            .Where(t => t.IsClass && !t.IsAbstract)
            .Where(t =>
                ServiceType.IsAssignableFrom(t) ||
                ScopedServiceType.IsAssignableFrom(t) ||
                SingletonServiceType.IsAssignableFrom(t))
            .Select(t => new
            {
                Implementation = t,
                Services = GetInterfacesForService(t).ToList(),
            })
            .ForEach(s => services.RegisterServices(s.Implementation, s.Services));

        return services;
    }

    private static IEnumerable<Type> GetInterfacesForService(Type type)
    {
        var interfaces = type.GetInterfaces();

        return type.IsGenericTypeDefinition
            ? GetInterfacesForService(type, interfaces).Select(x => x.GetGenericTypeDefinition())
            : GetInterfacesForService(type, interfaces);
    }

    private static void RegisterServices(
        this IServiceCollection services,
        Type implementation,
        IList<Type> interfaces)
    {
        if (implementation == null)
        {
            throw new ArgumentException("Cannot register service with no implementation");
        }

        if (SingletonServiceType.IsAssignableFrom(implementation))
        {
            if (interfaces.Any())
            {
                interfaces.ForEach(i => services.AddSingleton(i, implementation));
            }
            else
            {
                services.AddSingleton(implementation);
            }
        }
        else if (ScopedServiceType.IsAssignableFrom(implementation))
        {
            if (interfaces.Any())
            {
                interfaces.ForEach(i => services.AddScoped(i, implementation));
            }
            else
            {
                services.AddScoped(implementation);
            }
        }
        else
        {
            if (interfaces.Any())
            {
                interfaces.ForEach(i => services.AddTransient(i, implementation));
            }
            else
            {
                services.AddTransient(implementation);
            }
        }
    }

    private static IEnumerable<Type> GetInterfacesForService(MemberInfo type, ICollection<Type> interfaces)
    {
        var interfaceBySameName = interfaces.FirstOrDefault(i => i.Name == $"I{type.Name}");

        if (interfaceBySameName != null)
        {
            return new List<Type> { interfaceBySameName };
        }

        var transientServiceInterface = GetInterfacesForServiceType(ServiceType, interfaces);

        if (transientServiceInterface.Any())
        {
            return transientServiceInterface;
        }

        var scopedServiceInterface = GetInterfacesForServiceType(ScopedServiceType, interfaces);

        return scopedServiceInterface.Any()
            ? scopedServiceInterface
            : GetInterfacesForServiceType(SingletonServiceType, interfaces);
    }

    private static IList<Type> GetInterfacesForServiceType(Type serviceType, IEnumerable<Type> interfaces)
        => interfaces.Where(i => i != serviceType && serviceType.IsAssignableFrom(i)).ToList();
}