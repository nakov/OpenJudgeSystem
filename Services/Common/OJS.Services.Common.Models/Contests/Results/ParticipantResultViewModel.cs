namespace OJS.Services.Common.Models.Contests.Results;

using OJS.Data.Models.Participants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public class ParticipantResultViewModel
{
    public static Expression<Func<Participant, ParticipantResultViewModel>> FromParticipant =>
        participant => new ParticipantResultViewModel
        {
            Id = participant.Id,
            ParticipantUsername = participant.User.UserName,
            ParticipantFirstName = participant.User.UserSettings.FirstName,
            ParticipantLastName = participant.User.UserSettings.LastName,
            ParticipantProblemIds = participant.ProblemsForParticipants.Select(p => p.ProblemId),
        };

    public int Id { get; set; }

    public string? ParticipantUsername { get; set; }

    public string? ParticipantFirstName { get; set; }

    public string? ParticipantLastName { get; set; }

    public IEnumerable<ProblemResultPairViewModel> ProblemResults { get; set; }
        = Enumerable.Empty<ProblemResultPairViewModel>();

    public string ParticipantFullName => $"{this.ParticipantFirstName?.Trim()} {this.ParticipantLastName?.Trim()}";

    public int Total => this.ProblemResults
        .Sum(pr => pr.BestSubmission.Points);

    public int AdminTotal => this.ProblemResults
        .Sum(pr => pr.BestSubmission.Points);

    public int ExportTotal => this.ProblemResults
        .Where(pr => !pr.IsExcludedFromHomework)
        .Sum(pr => pr.BestSubmission.Points);

    public IEnumerable<int> ParticipantProblemIds { get; set; } = Enumerable.Empty<int>();

    public static Expression<Func<Participant, ParticipantResultViewModel>> FromParticipantAsSimpleResultByContest(int contestId) =>
        participant => new ParticipantResultViewModel
        {
            ParticipantUsername = participant.User.UserName,
            ParticipantFirstName = participant.User.UserSettings.FirstName,
            ParticipantLastName = participant.User.UserSettings.LastName,
            ParticipantProblemIds = participant.ProblemsForParticipants.Select(p => p.ProblemId),
            ProblemResults = participant.Scores
                .Where(sc => !sc.Problem.IsDeleted && sc.Problem.ProblemGroup.ContestId == contestId)
                .AsQueryable()
                .Select(ProblemResultPairViewModel.FromParticipantScoreAsSimpleResult)
                .ToList(),
        };

    public static Expression<Func<Participant, ParticipantResultViewModel>> FromParticipantAsFullResultByContest(int contestId) =>
        participant => new ParticipantResultViewModel
        {
            ParticipantUsername = participant.User.UserName,
            ParticipantFirstName = participant.User.UserSettings.FirstName,
            ParticipantLastName = participant.User.UserSettings.LastName,
            ProblemResults = participant.Scores
                .Where(sc => !sc.Problem.IsDeleted && sc.Problem.ProblemGroup.ContestId == contestId)
                .AsQueryable()
                .Select(ProblemResultPairViewModel.FromParticipantScoreAsFullResult)
                .ToList(),
        };

    public static Expression<Func<Participant, ParticipantResultViewModel>> FromParticipantAsExportResultByContest(int contestId) =>
        participant => new ParticipantResultViewModel
        {
            ParticipantUsername = participant.User.UserName,
            ParticipantFirstName = participant.User.UserSettings.FirstName,
            ParticipantLastName = participant.User.UserSettings.LastName,
            ProblemResults = participant.Scores
                .Where(sc => !sc.Problem.IsDeleted && sc.Problem.ProblemGroup.ContestId == contestId)
                .AsQueryable()
                .Select(ProblemResultPairViewModel.FromParticipantScoreAsExportResult)
                .ToList(),
        };
}