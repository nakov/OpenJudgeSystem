namespace OJS.Services.Infrastructure.Mapping.Implementations
{
    using AutoMapper;
    using System.Linq;

    public class MapperService : IMapperService
    {
        private readonly IMapper mapper;

        public MapperService(IMapper mapper) => this.mapper = mapper;

        public TDestination Map<TDestination>(object source)
            => this.mapper.Map<TDestination>(source);

        public IQueryable<TDestination> ProjectTo<TDestination>(IQueryable<object> source)
            => this.mapper.ProjectTo<TDestination>(source);
    }
}