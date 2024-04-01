namespace OJS.Services.Ui.Models.Submissions;

using AutoMapper;
using FluentExtensions.Extensions;
using OJS.Data.Models.Submissions;
using OJS.Services.Ui.Models.Submissions.PublicSubmissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;

public class AdminPublicSubmissionsServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public DateTime CreatedOn { get; set; }

    public string StrategyName { get; set; } = null!;

    public bool IsOfficial { get; set; }

    public UserForPublicSubmissionsServiceModel User { get; set; } = null!;

    public ProblemForPublicSubmissionsServiceModel Problem { get; set; } = null!;

    public ResultForPublicSubmissionsServiceModel Result { get; set; } = null!;

    public StateResultForPublicSubmissionsServiceModel State { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public bool Processed { get; set; }

    public long? MaxMemoryUsed { get; set; }

    public int? MaxTimeUsed { get; set; }

    public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = Enumerable.Empty<TestRunServiceModel>();

    public int PageNumber { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Submission, AdminPublicSubmissionsServiceModel>()
            .ForMember(
                x => x.StrategyName,
                opt => opt.MapFrom(
                    y => y.SubmissionType!.Name))
            .ForMember(
                x => x.User,
                opt => opt.MapFrom(
                    y => y.Participant!.User))
            .ForMember(
                x => x.Result,
                opt => opt.MapFrom(
                    y => y))
            .ForMember(
                x => x.State,
                opt => opt.MapFrom(
                    y => y.Processed
                        ? StateResultForPublicSubmissionsServiceModel.Ready
                        : StateResultForPublicSubmissionsServiceModel.Queued))
            .ForMember(
                x => x.Result,
                opt => opt.MapFrom(
                    y => new ResultForPublicSubmissionsServiceModel
                    {
                        Points = y.Points,
                        MaxPoints =
                            y.Problem.IsNull()
                                ? 0
                                : y.Problem!.MaximumPoints,
                    }))
            .ForMember(
                x => x.IsOfficial,
                opt => opt.MapFrom(
                    y => y.Participant!.IsOfficial))
            .ForMember(
                d => d.MaxMemoryUsed,
                opt => opt.MapFrom(s => s.TestRuns.Any() ? s.TestRuns.Max(testRun => testRun.MemoryUsed) : (long?)null))
            .ForMember(
                d => d.MaxTimeUsed,
                opt => opt.MapFrom(s =>
                    s.TestRuns.Any() ? s.TestRuns.Max(testRun => testRun.TimeUsed) : (int?)null))
            .ForMember(
                x => x.PageNumber,
                opt => opt.Ignore());
}