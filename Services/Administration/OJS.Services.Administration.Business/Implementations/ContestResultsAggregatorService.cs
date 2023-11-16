namespace OJS.Services.Administration.Business.Implementations;

using OJS.Data.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Contests.Results;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestResultsAggregatorService : IContestResultsAggregatorService
{
    private readonly IParticipantsCommonDataService participantsCommonData;
    private readonly IContestsActivityService activityService;

    public ContestResultsAggregatorService(IParticipantsCommonDataService participantsCommonData, IContestsActivityService activityService)
    {
        this.participantsCommonData = participantsCommonData;
        this.activityService = activityService;
    }

    public ContestResultsViewModel GetContestResults(
            Contest contest,
            bool official,
            bool isUserAdminOrLecturer,
            bool isFullResults,
            bool isExportResults = false)
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

        var participants = this.participantsCommonData
                .GetAllByContestAndIsOfficial(contest.Id, official);

        var participantResults = participants
                .Select(ParticipantResultViewModel.FromParticipantAsSimpleResultByContest(contest.Id))
                .OrderByDescending(parRes => parRes.ProblemResults
                    .Where(pr => pr.ShowResult)
                    .Sum(pr => pr.BestSubmission.Points));

        if (isFullResults)
        {
            participantResults = participants
                .Select(ParticipantResultViewModel.FromParticipantAsFullResultByContest(contest.Id))
                .OrderByDescending(parRes => parRes.ProblemResults
                    .Sum(pr => pr.BestSubmission.Points));
        }
        else if (isExportResults)
        {
            participantResults = participants
                .Select(ParticipantResultViewModel.FromParticipantAsExportResultByContest(contest.Id))
                .OrderByDescending(parRes => parRes.ProblemResults
                    .Where(pr => pr.ShowResult && !pr.IsExcludedFromHomework)
                    .Sum(pr => pr.BestSubmission.Points));
        }

        contestResults.Results = participantResults
                .ThenBy(parResult => parResult.ProblemResults
                    .OrderByDescending(pr => pr.BestSubmission.Id)
                    .Select(pr => pr.BestSubmission.Id)
                    .FirstOrDefault());

        return contestResults;
    }
}