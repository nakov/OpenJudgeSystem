namespace OJS.Services.Common.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;

public class ContestResultsAggregatorCommonService : IContestResultsAggregatorCommonService
{
    private readonly IParticipantScoresCommonDataService participantScoresCommonDataService;
    private readonly IParticipantsCommonDataService participantsCommonData;

    public ContestResultsAggregatorCommonService(
        IParticipantScoresCommonDataService participantScoresCommonDataService,
        IParticipantsCommonDataService participantsCommonData)
    {
        this.participantScoresCommonDataService = participantScoresCommonDataService;
        this.participantsCommonData = participantsCommonData;
    }

    public ContestResultsViewModel GetContestResults(
        ContestResultsModel contestResultsModel,
        IContestActivityServiceModel contestActivity)
    {
        var contestResults = contestResultsModel.Map<ContestResultsViewModel>();
        contestResults.Id = contestResultsModel.Contest.Id;

        contestResults.ContestCanBeCompeted = contestActivity.CanBeCompeted;
        contestResults.ContestCanBePracticed = contestActivity.CanBePracticed;

        var problems = contestResultsModel.Problems
            .AsQueryable()
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.OrderBy)
            .ThenBy(p => p.Name)
            .Select(ContestProblemListViewModel.FromProblem)
            .ToList();

        // Get the requested participants without their problem results.
        // Splitting the queries improves performance and avoids unexpected results from joins with Scores.
        var participants = this.participantsCommonData
            .GetAllByContestAndIsOfficial(contestResultsModel.Contest.Id, contestResultsModel.Official)
            .AsNoTracking()
            .OrderByDescending(p => p.TotalScoreSnapshot)
            .ThenBy(p => p.TotalScoreSnapshotModifiedOn)
            .Select(ParticipantResultViewModel.FromParticipant)
            .ToPagedResult(contestResultsModel.ItemsPerPage, contestResultsModel.Page);

        // Get the ParticipantScores with another query and map problem results for each participant.
        var participantScores = this.participantScoresCommonDataService
            .GetAllByParticipants(participants.Items.Select(p => p.Id))
            .AsNoTracking();

        var problemResults = contestResultsModel.IsFullResults
            ? [.. participantScores.Select(ProblemResultPairViewModel.FromParticipantScoreAsFullResult)]
            : (IEnumerable<ProblemResultPairViewModel>)(contestResultsModel.IsExportResults
                ? [.. participantScores.Select(ProblemResultPairViewModel.FromParticipantScoreAsExportResult)]
                : [.. participantScores.Select(ProblemResultPairViewModel.FromParticipantScoreAsSimpleResult)]);

        participants.Items.ForEach(p =>
            p.ProblemResults = problemResults.Where(pr => pr.ParticipantId == p.Id));

        contestResults.Problems = problems;
        contestResults.PagedResults = participants;

        return contestResults;
    }
}