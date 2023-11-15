namespace OJS.Services.Administration.Business.Implementations;

using OJS.Services.Ui.Models.Contests;
using OJS.Services.Ui.Data;
using OJS.Data.Models.Participants;
using X.PagedList;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using OJS.Data.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestResultsAggregatorService : IContestResultsAggregatorService
{
    private readonly IContestsActivityService activityService;
    private readonly IParticipantScoresDataService participantScoresDataService;
    private readonly IParticipantsDataService participantsData;

    public ContestResultsAggregatorService(
        IContestsActivityService activityService,
        IParticipantScoresDataService participantScoresDataService,
        IParticipantsDataService participantsData)
    {
        this.activityService = activityService;
        this.participantScoresDataService = participantScoresDataService;
        this.participantsData = participantsData;
    }

    public ContestResultsViewModel GetContestResults(ContestResultsModel contestResultsModel)
    {
        var contestActivityEntity = this.activityService
            .GetContestActivity(contestResultsModel.Contest.Map<ContestForActivityServiceModel>());

        var contestResults = contestResultsModel.Map<ContestResultsViewModel>();

        contestResults.ContestCanBeCompeted = contestActivityEntity.CanBeCompeted;
        contestResults.ContestCanBePracticed = contestActivityEntity.CanBePracticed;

        var totalParticipantsCount = contestResultsModel.TotalResultsCount
                                     ?? this.participantsData
                                         .GetAllByContestAndIsOfficial(
                                             contestResultsModel.Contest.Id,
                                             contestResultsModel.Official)
                                         .Count();

        // Get the requested participants without their problem results.
        // Splitting the queries improves performance and avoids unexpected results from joins with Scores.
        var participants = this.GetParticipantsPage(
                contestResultsModel.Contest,
                contestResultsModel.Official,
                contestResultsModel.Page,
                contestResultsModel.ItemsInPage)
                .Select(ParticipantResultViewModel.FromParticipant)
                .ToList();

        // Get the ParticipantScores with another query and map problem results for each participant.
        var participantScores = this.participantScoresDataService
            .GetAllByParticipants(participants.Select(p => p.Id));

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

        participants.ForEach(p =>
            p.ProblemResults = problemResults.Where(pr => pr.ParticipantId == p.Id));

        var results = new StaticPagedList<ParticipantResultViewModel>(
            participants,
            contestResultsModel.Page,
            contestResultsModel.ItemsInPage,
            totalParticipantsCount);

        contestResults.Results = results;

        return contestResults;
    }

    /// <summary>
    /// Gets IQueryable results with one page of participants, ordered by top score.
    /// </summary>
    private IQueryable<Participant> GetParticipantsPage(Contest contest, bool official, int page, int itemsInPage) =>
        this.participantsData
            .GetAllByContestAndIsOfficial(contest.Id, official)
            .AsNoTracking()
            .OrderByDescending(p => p.TotalScoreSnapshot)
            .ThenBy(p => p.TotalScoreSnapshotModifiedOn)
            .Skip((page - 1) * itemsInPage)
            .Take(itemsInPage);
}