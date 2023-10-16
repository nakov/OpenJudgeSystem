namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Ui.Data;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using System.Linq;

public class ContestResultsAggregatorService : IContestResultsAggregatorService
{
    private readonly IParticipantsCommonDataService participantsCommonData;

    public ContestResultsAggregatorService(IParticipantsCommonDataService participantsCommonData)
        => this.participantsCommonData = participantsCommonData;

    public ContestResultsServiceModel GetContestResults(
            ContestResultsServiceModel contest,
            bool official,
            bool isUserAdminOrLecturer,
            bool isFullResults,
            bool isExportResults = false)
    {
        // Problems = contest.ProblemGroups
        //     .SelectMany(pg => pg.Problems)
        //     .AsQueryable()
        //     .Where(p => !p.IsDeleted)
        //     .OrderBy(p => p.OrderBy)
        //     .ThenBy(p => p.Name)
        //     .Select(ContestProblemListServiceModel.FromProblem),

        var problems =


            var participants = this.participantsCommonData
                .GetAllByContestAndIsOfficial(contest.Id, official);

            var participantResults = participants
                .Select(ParticipantResultServiceModel.FromParticipantAsSimpleResultByContest(contest.Id))
                .OrderByDescending(parRes => parRes.ProblemResults
                    .Where(pr => pr.ShowResult)
                    .Sum(pr => pr.BestSubmission.Points));

            if (isFullResults)
            {
                participantResults = participants
                    .Select(ParticipantResultServiceModel.FromParticipantAsFullResultByContest(contest.Id))
                    .OrderByDescending(parRes => parRes.ProblemResults
                        .Sum(pr => pr.BestSubmission.Points));
            }
            else if (isExportResults)
            {
                participantResults = participants
                    .Select(ParticipantResultServiceModel.FromParticipantAsExportResultByContest(contest.Id))
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