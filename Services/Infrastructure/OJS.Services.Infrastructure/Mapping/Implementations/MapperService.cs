namespace OJS.Services.Infrastructure.Mapping.Implementations
{
    using AutoMapper;

    public class MapperService : IMapperService
    {
        private readonly IMapper mapper;

        public MapperService(IMapper mapper) => this.mapper = mapper;

        public TDestination Map<TDestination>(object source)
            => this.mapper.Map<TDestination>(source);
    }
}