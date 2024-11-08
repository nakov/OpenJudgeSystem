namespace OJS.Services.Ui.Models.Cache;

using System;
using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ContestCacheModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public bool IsVisible { get; set; }

    public DateTime? VisibleFrom { get; set; }

    public int? CategoryId { get; set; }

    public ContestType Type { get; set; }

    public TimeSpan? Duration { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public string? ContestPassword { get; set; }

    public string? PracticePassword { get; set; }

    public string? NewIpPassword { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }

    public int LimitBetweenSubmissions { get; set; }

    public double OrderBy { get; set; }

    public short NumberOfProblemGroups { get; set; }

    public string? Description { get; set; }

    public bool AllowParallelSubmissionsInTasks { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? DeletedOn { get; set; }

    public bool ResultsArePubliclyVisible { get; set; }

    public bool HasContestPassword { get; set; }

    public bool HasPracticePassword { get; set; }

    public bool IsOnlineExam { get; set; }

    public bool IsOnsiteExam { get; set; }

    public bool IsExam { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Contest, ContestCacheModel>()
            .ReverseMap();
}