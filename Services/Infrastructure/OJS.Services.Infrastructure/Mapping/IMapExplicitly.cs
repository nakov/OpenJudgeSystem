namespace OJS.Services.Infrastructure.Mapping
{
    using AutoMapper;

    public interface IMapExplicitly
    {
        void RegisterMappings(IProfileExpression configuration);
    }
}