namespace OJS.Services.Ui.Models.Submissions;

using AutoMapper;
using FluentExtensions.Extensions;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class UserForPublicSubmissionsServiceModel
    : IMapExplicitly
{
    public string Id { get; set; }

    public object Username { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<UserProfile, UserForPublicSubmissionsServiceModel>()
            .ForMember(
                x => x.Username,
                opt => opt.MapFrom(y => y.UserName));
}

public class ProblemForPublicSubmissionsServiceModel
    : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; }

    public ContestForPublicSubmissionsServiceModel Contest { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Problem, ProblemForPublicSubmissionsServiceModel>()
            .ForMember(
                x => x.Contest,
                opt => opt.MapFrom(
                    y => y.ProblemGroup.Contest));
}

public class ContestForPublicSubmissionsServiceModel
    : IMapFrom<Contest>
{
    public int Id { get; set; }

    public string Name { get; set; }
}

public class ResultForPublicSubmissionsServiceModel
{
    public int Points { get; set; }

    public int MaxPoints { get; set; }
}

public enum StateResultForPublicSubmissionsServiceModel
{
    Ready = 1,
    Processing = 2,
    Queued = 3,
}

public class SubmissionForPublicSubmissionsServiceModel
    : IMapExplicitly
{
    public int Id { get; set; }

    public DateTime CreatedOn { get; set; }

    public string StrategyName { get; set; }

    public bool IsOfficial { get; set; }

    public UserForPublicSubmissionsServiceModel User { get; set; }

    public ProblemForPublicSubmissionsServiceModel Problem { get; set; }

    public ResultForPublicSubmissionsServiceModel Result { get; set; }

    public StateResultForPublicSubmissionsServiceModel State { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Submission, SubmissionForPublicSubmissionsServiceModel>()
            .ForMember(
                x => x.StrategyName,
                opt => opt.MapFrom(
                    y => y.SubmissionType.Name))
            .ForMember(
                x => x.User,
                opt => opt.MapFrom(
                    y => y.Participant.User))
            .ForMember(
                x => x.Problem,
                opt => opt.MapFrom(
                    y => y.Problem))
            .ForMember(
                x => x.Result,
                opt => opt.MapFrom(
                    y => y))
            .ForMember(
                x => x.State,
                opt => opt.MapFrom(
                    y => y.Processed
                        ? StateResultForPublicSubmissionsServiceModel.Ready
                        : StateResultForPublicSubmissionsServiceModel.Processing
                ))
            .ForMember(
                x => x.Result,
                opt => opt.MapFrom(
                    y => new ResultForPublicSubmissionsServiceModel
                    {
                        Points = y.Points,
                        MaxPoints =
                            y.Problem.IsNull()
                                ? 0
                                : y.Problem.MaximumPoints,
                    }))
            .ForMember(
                x => x.IsOfficial,
                opt => opt.MapFrom(
                    y => y.Participant.IsOfficial));
}