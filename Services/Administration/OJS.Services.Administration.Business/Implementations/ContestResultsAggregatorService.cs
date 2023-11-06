namespace OJS.Services.Administration.Business.Implementations;

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

    public ContestResultsViewModel GetContestResults(
            Contest contest,
            bool official,
            bool isUserAdminOrLecturer,
            bool isFullResults,
            bool isExportResults = false,
            int? totalResultsCount = null,
            int page = 1,
            int itemsInPage = int.MaxValue)
    {
        var contestActivityEntity = this.activityService
            .GetContestActivity(contest.Map<ContestForActivityServiceModel>());

        var contestResults = new ContestResultsViewModel
            {
                Id = contest.Id,
                Name = contest.Name,
                IsCompete = official,
                ContestCanBeCompeted = contestActivityEntity.CanBeCompeted,
                ContestCanBePracticed = contestActivityEntity.CanBePracticed,
                UserHasContestRights = isUserAdminOrLecturer,
                ContestType = contest.Type,
                Problems = contest.ProblemGroups
                    .SelectMany(pg => pg.Problems)
                    .AsQueryable()
                    .Where(p => !p.IsDeleted)
                    .OrderBy(p => p.OrderBy)
                    .ThenBy(p => p.Name)
                    .Select(ContestProblemListViewModel.FromProblem),
            };

        var totalParticipantsCount = totalResultsCount
                                     ?? this.participantsData
                                         .GetAllByContestAndIsOfficial(contest.Id, official)
                                         .Count();

        // Get the requested participants without their problem results.
        // Splitting the queries improves performance and avoids unexpected results from joins with Scores.
        var participants = this.GetParticipantsPage(contest, official, page, itemsInPage)
                .Select(ParticipantResultViewModel.FromParticipant)
                .ToList();

        // Get the ParticipantScores with another query and map problem results for each participant.
        var participantScores = this.participantScoresDataService
            .GetAllByParticipants(participants.Select(p => p.Id))
            .AsNoTracking();

        IEnumerable<ProblemResultPairViewModel> problemResults;

        if (isFullResults)
        {
            problemResults = participantScores
                .Select(ProblemResultPairViewModel.FromParticipantScoreAsFullResult)
                .ToList();
        }
        else if (isExportResults)
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

        var results = new StaticPagedList<ParticipantResultViewModel>(participants, page, itemsInPage, totalParticipantsCount);

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