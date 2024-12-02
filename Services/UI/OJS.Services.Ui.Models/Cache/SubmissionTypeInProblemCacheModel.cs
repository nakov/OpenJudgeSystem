namespace OJS.Services.Ui.Models.Cache;

using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeInProblemCacheModel : IMapExplicitly
{
    public int SubmissionTypeId { get; set; }

    public SubmissionTypeCacheModel SubmissionType { get; set; } = null!;

    public int ProblemId { get; set; }

    public byte[]? SolutionSkeleton { get; set; }

    public int? TimeLimit { get; set; }

    public int? MemoryLimit { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<SubmissionTypeInProblem, SubmissionTypeInProblemCacheModel>()
            .ReverseMap();
}