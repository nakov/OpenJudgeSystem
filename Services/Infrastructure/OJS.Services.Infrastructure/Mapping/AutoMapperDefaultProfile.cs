namespace OJS.Services.Infrastructure.Mapping
{
    using AutoMapper;
    using OJS.Common.Extensions;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class AutoMapperDefaultProfile : Profile
    {
        private static readonly Type MapFromType = typeof(IMapFrom<>);
        private static readonly Type MapToType = typeof(IMapTo<>);

        public AutoMapperDefaultProfile()
            => AppDomain.CurrentDomain
                .GetAssemblies()
                .Where(a => !a.IsDynamic)
                .SelectMany(a => a.ExportedTypes)
                .Where(t => t.IsClass && !t.IsAbstract)
                .Select(t => new
                {
                    Type = t,
                    AllMapFrom = GetMappingModels(t, MapFromType),
                    AllMapTo = GetMappingModels(t, MapToType),
                })
                .ForEach(t =>
                {
                    t.AllMapFrom
                        .ForEach(mapFrom => this.CreateMap(mapFrom, t.Type));

                    t.AllMapTo
                        .ForEach(mapTo => this.CreateMap(t.Type, mapTo));
                });

        private static IEnumerable<Type> GetMappingModels(Type source, Type mappingType)
            => source
                .GetInterfaces()
                .Where(i => i.IsGenericType && i.GetGenericTypeDefinition() == mappingType)
                .Select(i => i.GetGenericArguments().First());
    }
}