namespace OJS.Services.Administration.Models.Tests;

using AutoMapper;
using OJS.Data.Models.Tests;
using OJS.Services.Infrastructure.Models.Mapping;

public class TestsInListModel : IMapExplicitly
{
    public int Id { get; set; }

    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public double OrderBy { get; set; }

    public int ProblemId { get; set; }

    public string? ProblemName { get; set; }

    public string? Type { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Test, TestsInListModel>()
            .ForMember(d => d.Type, opt => opt.MapFrom(t
                => TestsMappingUtils.MapTestType(t.IsTrialTest, t.IsOpenTest)));
}