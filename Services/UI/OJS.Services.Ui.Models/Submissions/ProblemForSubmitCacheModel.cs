namespace OJS.Services.Ui.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Services.Ui.Models.Cache;
using System.Collections.Generic;

public class ProblemForSubmitCacheModel : IMapExplicitly
{
    public int Id { get; set; }

    public int ProblemGroupId { get; set; }

    public ProblemGroupCacheModel ProblemGroup { get; set; } = null!;

    public ContestCacheModel? Contest { get; set; } = null!;

    public string Name { get; set; } = string.Empty;

    public short MaximumPoints { get; set; }

    public int TimeLimit { get; set; }

    public int MemoryLimit { get; set; }

    public int? SourceCodeSizeLimit { get; set; }

    public int? CheckerId { get; set; }

    public bool ShowResults { get; set; }

    public CheckerCacheModel? Checker { get; set; }

    public ICollection<SubmissionTypeInProblemCacheModel> SubmissionTypesInProblems { get; set; } = [];

    public ICollection<TestCacheModel> Tests { get; set; } = [];

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Problem, ProblemForSubmitCacheModel>()
            .ForMember(m => m.Contest, opt => opt.Ignore())
            .ForMember(m => m.Tests, opt => opt.Ignore())
            .ForMember(m => m.Checker, opt => opt.Ignore())
            .ReverseMap();
}