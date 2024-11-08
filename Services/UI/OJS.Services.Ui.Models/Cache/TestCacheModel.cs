namespace OJS.Services.Ui.Models.Cache;

using AutoMapper;
using OJS.Data.Models.Tests;
using OJS.Services.Infrastructure.Models.Mapping;

public class TestCacheModel : IMapExplicitly
{
    public int Id { get; set; }

    public int ProblemId { get; set; }

    public byte[] InputData { get; set; } = [];

    public string InputDataAsString { get; set; } = string.Empty;

    public byte[] OutputData { get; set; } = [];

    public string OutputDataAsString { get; set; } = string.Empty;

    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public double OrderBy { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Test, TestCacheModel>()
            .ReverseMap();
}