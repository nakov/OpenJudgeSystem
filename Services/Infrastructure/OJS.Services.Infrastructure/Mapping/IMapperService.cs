namespace OJS.Services.Infrastructure.Mapping
{
    using System.Linq;

    public interface IMapperService : IService
    {
        TDestination Map<TDestination>(object source);

        IQueryable<TDestination> ProjectTo<TDestination>(IQueryable<object> source);
    }
}