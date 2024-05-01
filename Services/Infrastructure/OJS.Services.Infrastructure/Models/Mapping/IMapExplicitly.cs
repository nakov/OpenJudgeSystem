namespace OJS.Services.Infrastructure.Models.Mapping;

using AutoMapper;

public interface IMapExplicitly
{
    void RegisterMappings(IProfileExpression configuration);
}
