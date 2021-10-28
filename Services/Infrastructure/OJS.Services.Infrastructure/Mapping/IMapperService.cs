namespace OJS.Services.Infrastructure.Mapping
{
    public interface IMapperService : IService
    {
        TDestination Map<TDestination>(object source);
    }
}