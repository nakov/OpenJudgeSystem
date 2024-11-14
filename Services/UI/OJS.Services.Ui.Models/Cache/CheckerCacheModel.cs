namespace OJS.Services.Ui.Models.Cache;

using AutoMapper;
using OJS.Data.Models.Checkers;
using OJS.Services.Infrastructure.Models.Mapping;

public class CheckerCacheModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? DllFile { get; set; }

    public string? ClassName { get; set; }

    public string? Parameter { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Checker, CheckerCacheModel>()
            .ReverseMap();
}