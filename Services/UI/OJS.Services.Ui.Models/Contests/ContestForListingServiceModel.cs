namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class ContestForListingServiceModel : IMapExplicitly, ICanBeCompetedAndPracticed
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }

    public string Category { get; set; } = string.Empty;

    public int? CategoryId { get; set; }

    public double OrderBy { get; set; }

    public TimeSpan? Duration { get; set; }

    public int NumberOfProblems { get; set; }

    public int CompeteResults { get; set; }

    public int PracticeResults { get; set; }

    public int CompeteMaximumPoints { get; set; }

    public int PracticeMaximumPoints { get; set; }

    public ParticipantResultServiceModel? UserParticipationResult { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Contest, ContestForListingServiceModel>()
            .ForMember(
                dest => dest.Category,
                opt => opt.MapFrom(src => src.Category!.Name))
            .ForMember(
                d => d.NumberOfProblems,
                opt => opt.MapFrom(src => src.ProblemGroups.Count(pg => pg.Problems.Count > 0)))
            .ForMember(
                d => d.Duration,
                opt => opt.MapFrom(src =>
                    src.Duration ?? ((src.StartTime.HasValue && src.EndTime.HasValue) ? (src.EndTime - src.StartTime) : null)))
            .ForMember(d => d.CanBeCompeted, opt => opt.Ignore())
            .ForMember(d => d.CanBePracticed, opt => opt.Ignore())
            .ForMember(
                d => d.PracticeMaximumPoints,
                opt => opt.MapFrom(src => src.ProblemGroups
                        .SelectMany(pg => pg.Problems)
                        .Where(x => !x.IsDeleted)
                        .Sum(pr => pr.MaximumPoints)))
            .ForMember(
                d => d.CompeteMaximumPoints,
                opt => opt.MapFrom(src => src.ProblemGroups
                    .SelectMany(pg => pg.Problems
                        .Where(p => !p.IsDeleted)
                        .Take(1))
                    .Sum(p => p.MaximumPoints)))
            // Mapped from cache
            .ForMember(d => d.UserParticipationResult, opt => opt.Ignore())
            .ForMember(d => d.CompeteResults, opt => opt.Ignore())
            .ForMember(d => d.PracticeResults, opt => opt.Ignore());
}