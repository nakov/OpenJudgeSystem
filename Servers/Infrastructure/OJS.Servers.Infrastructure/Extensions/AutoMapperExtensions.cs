namespace OJS.Servers.Infrastructure.Extensions;

using AutoMapper;
using OJS.Services.Infrastructure.Models.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

public static class AutoMapperExtensions
{
    private static readonly Type MapFromType = typeof(IMapFrom<>);
    private static readonly Type MapToType = typeof(IMapTo<>);
    private static readonly Type ExplicitMapType = typeof(IMapExplicitly);

    public static void RegisterMappingsFrom(
        this IMapperConfigurationExpression mapper,
        params Assembly[] assemblies)
        => assemblies
            .SelectMany(a => a.ExportedTypes)
            .Where(t => t.IsClass && !t.IsAbstract)
            .Select(t => new
            {
                Type = t,
                AllMapFrom = GetMappingModels(t, MapFromType),
                AllMapTo = GetMappingModels(t, MapToType),
                ExplicitMap = t
                    .GetInterfaces()
                    .Where(i => ExplicitMapType.IsAssignableFrom(i))
                    .Select(i => (IMapExplicitly?)Activator.CreateInstance(t))
                    .FirstOrDefault(),
            })
            .ToList()
            .ForEach(t =>
            {
                t.AllMapFrom
                    .ToList()
                    .ForEach(mapFrom => mapper.CreateMap(mapFrom, t.Type));

                t.AllMapTo
                    .ToList()
                    .ForEach(mapTo => mapper.CreateMap(t.Type, mapTo));

                t.ExplicitMap?.RegisterMappings(mapper);
            });

    private static IEnumerable<Type> GetMappingModels(Type source, Type mappingType)
        => source
            .GetInterfaces()
            .Where(i => i.IsGenericType && i.GetGenericTypeDefinition() == mappingType)
            .Select(i => i.GetGenericArguments().First());
}