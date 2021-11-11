namespace OJS.Services.Infrastructure.Mapping
{
    using System.Collections.Generic;
    using System.Linq;

    public interface IMapperService : IService
    {
        TDestination Map<TDestination>(object source);

        IEnumerable<TDestination> MapCollection<TDestination>(IEnumerable<object> source);

        IQueryable<TDestination> ProjectTo<TDestination>(IQueryable<object> source);
    }
}