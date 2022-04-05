using OJS.Services.Ui.Models.Submissions;
using System.Collections;
using System.Collections.Generic;

namespace OJS.Services.Ui.Business.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using OJS.Services.Ui.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Common;
    using OJS.Services.Common;
    using OJS.Services.Infrastructure.Exceptions;
    using OJS.Services.Ui.Models.Problems;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

    public class ParticipantScoresBusinessService : IParticipantScoresBusinessService
    {
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IParticipantsDataService participantsData;
        private readonly IProblemsDataService problemsDataService;
        private readonly ISubmissionsDataService submissionsData;
        private readonly IUserProviderService userProviderService;

        public ParticipantScoresBusinessService(
            IParticipantScoresDataService participantScoresData,
            IParticipantsDataService participantsData,
            ISubmissionsDataService submissionsData,
            IProblemsDataService problemsDataService,
            IUserProviderService userProviderService)
        {
            this.participantScoresData = participantScoresData;
            this.participantsData = participantsData;
            this.submissionsData = submissionsData;
            this.problemsDataService = problemsDataService;
            this.userProviderService = userProviderService;
        }

        public async Task RecalculateForParticipantByProblem(int participantId, int problemId)
        {
            var submission = this.submissionsData.GetBestForParticipantByProblem(participantId, problemId);

            if (submission != null)
            {
                await this.participantScoresData.ResetBySubmission(submission);
            }
            else
            {
                await this.participantScoresData.DeleteForParticipantByProblem(participantId, problemId);
            }
        }

        public async Task NormalizeAllPointsThatExceedAllowedLimit()
        {
            using var scope = TransactionsHelper.CreateLongRunningTransactionScope();
            await this.NormalizeSubmissionPoints();
            await this.NormalizeParticipantScorePoints();

            scope.Complete();
        }

        private async Task NormalizeSubmissionPoints()
            => await (await this.submissionsData
                .GetAllHavingPointsExceedingLimit()
                .Select(s => new
                {
                    Submission = s,
                    ProblemMaxPoints = s.Problem!.MaximumPoints,
                })
                .ToListAsync())
                .ForEachSequential(async x =>
                {
                    x.Submission.Points = x.ProblemMaxPoints;

                    this.submissionsData.Update(x.Submission);
                    await this.submissionsData.SaveChanges();
                });

        private async Task NormalizeParticipantScorePoints()
            => await (await this.participantScoresData
                .GetAllHavingPointsExceedingLimit()
                .Select(ps => new
                {
                    ParticipantScore = ps,
                    ProblemMaxPoints = ps.Problem.MaximumPoints
                })
                .ToListAsync())
                .ForEachSequential(async x =>
                    await this.participantScoresData.UpdateBySubmissionAndPoints(
                        x.ParticipantScore,
                        x.ParticipantScore.SubmissionId,
                        x.ProblemMaxPoints));

        public async Task SaveForSubmission(Submission submission)
        {
            if (submission.ParticipantId == null || submission.ProblemId == null)
            {
                return;
            }

            var participant = this.participantsData
                .GetByIdQuery(submission.ParticipantId.Value)
                .Select(p => new
                {
                    p.IsOfficial,
                    p.User.UserName
                })
                .FirstOrDefault();

            if (participant == null)
            {
                return;
            }

            var existingScore = await this.participantScoresData.GetByParticipantIdProblemIdAndIsOfficial(
                submission.ParticipantId.Value,
                submission.ProblemId.Value,
                participant.IsOfficial);

            if (existingScore == null)
            {
                await this.participantScoresData.AddBySubmissionByUsernameAndIsOfficial(
                    submission,
                    participant.UserName,
                    participant.IsOfficial);

                return;
            }

            if (submission.Points > existingScore.Points ||
                submission.Id == existingScore.SubmissionId)
            {
                await this.participantScoresData.UpdateBySubmissionAndPoints(
                    existingScore,
                    submission.Id,
                    submission.Points);
            }
        }

        public async Task<IEnumerable<ProblemResultServiceModel>> GetParticipantScoresByProblemForUser(int problemId, bool isOfficial)
        {
            var problem = await this.problemsDataService.GetWithProblemGroupById(problemId);

            if (problem == null)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.Problem_not_found);
            }

            var user = this.userProviderService.GetCurrentUser();

            var userHasParticipation = await this.participantsData
                .ExistsByContestByUserAndIsOfficial(problem.ProblemGroup.ContestId, user.Id, isOfficial);

            if (!userHasParticipation)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.User_is_not_registered_for_exam);
            }

            if (!problem.ShowResults)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.Problem_results_not_available);
            }

            var participant =
                await this.participantsData.GetByContestByUserAndByIsOfficial(problem.ProblemGroup.ContestId, user.Id,
                    isOfficial);

            var results = await this.participantScoresData
                .GetAll()
                .Where(ps => ps.ProblemId == problem.Id && ps.IsOfficial == isOfficial && ps.ParticipantId == participant.Id)
                .MapCollection<ProblemResultServiceModel>()
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<ParticipantScoreModel>> GetByProblemForParticipants(
            IEnumerable<int> participantIds, int problemId)
            => await this.participantScoresData
                .GetByProblemIdAndParticipants(participantIds, problemId)
                .MapCollection<ParticipantScoreModel>()
                .ToListAsync();
    }
}