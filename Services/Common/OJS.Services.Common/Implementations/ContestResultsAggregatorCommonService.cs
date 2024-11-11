namespace OJS.Services.Common.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Data;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;

public class ContestResultsAggregatorCommonService : IContestResultsAggregatorCommonService
{
    private readonly IContestsActivityService activityService;
    private readonly IParticipantScoresCommonDataService participantScoresCommonDataService;
    private readonly IParticipantsCommonDataService participantsCommonData;

    public ContestResultsAggregatorCommonService(
        IContestsActivityService activityService,
        IParticipantScoresCommonDataService participantScoresCommonDataService,
        IParticipantsCommonDataService participantsCommonData)
    {
        this.activityService = activityService;
        this.participantScoresCommonDataService = participantScoresCommonDataService;
        this.participantsCommonData = participantsCommonData;
    }

    public ContestResultsViewModel GetContestResults(ContestResultsModel contestResultsModel)
    {
        var contestActivityEntity = this.activityService
            .GetContestActivity(contestResultsModel.Contest.Map<ContestForActivityServiceModel>())
            .GetAwaiter()
            .GetResult();

        var contestResults = contestResultsModel.Map<ContestResultsViewModel>();
        contestResults.Id = contestResultsModel.Contest.Id;

        contestResults.ContestCanBeCompeted = contestActivityEntity.CanBeCompeted;
        contestResults.ContestCanBePracticed = contestActivityEntity.CanBePracticed;

        var problems = contestResultsModel.Problems
            .AsQueryable()
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.OrderBy)
            .ThenBy(p => p.Name)
            .Select(ContestProblemListViewModel.FromProblem)
            .ToList();

        // Get the requested participants without their problem results.
        // Splitting the queries improves performance and avoids unexpected results from joins with Scores.
        var participants = this.GetParticipantsPage(
                contestResultsModel.Contest,
                contestResultsModel.Official)
            .Select(ParticipantResultViewModel.FromParticipant)
            .ToPagedResult(contestResultsModel.ItemsPerPage, contestResultsModel.Page);

        // Get the ParticipantScores with another query and map problem results for each participant.
        var participantScores = this.participantScoresCommonDataService
            .GetAllByParticipants(participants.Items.Select(p => p.Id))
            .Include(x => x.Participant)
            .Include(x => x.Submission)
            .Include(x => x.Problem)
            .AsNoTracking();

        IEnumerable<ProblemResultPairViewModel> problemResults;

        if (contestResultsModel.IsFullResults)
        {
            problemResults = participantScores
                .Select(ProblemResultPairViewModel.FromParticipantScoreAsFullResult)
                .ToList();
        }
        else if (contestResultsModel.IsExportResults)
        {
            problemResults = participantScores
                .Select(ProblemResultPairViewModel.FromParticipantScoreAsExportResult)
                .ToList();
        }
        else
        {
            problemResults = participantScores
                .Select(ProblemResultPairViewModel.FromParticipantScoreAsSimpleResult)
                .ToList();
        }

        participants.Items.ForEach(p =>
            p.ProblemResults = problemResults.Where(pr => pr.ParticipantId == p.Id));

        contestResults.Problems = problems;
        contestResults.PagedResults = participants;

        return contestResults;
    }

    /// <summary>
    /// Gets IQueryable results with one page of participants, ordered by top score.
    /// </summary>
    private IQueryable<Participant> GetParticipantsPage(Contest contest, bool official) =>
        this.participantsCommonData
            .GetAllByContestAndIsOfficial(contest.Id, official)
            .AsNoTracking()
            .OrderByDescending(p => p.TotalScoreSnapshot)
            .ThenBy(p => p.TotalScoreSnapshotModifiedOn);
}