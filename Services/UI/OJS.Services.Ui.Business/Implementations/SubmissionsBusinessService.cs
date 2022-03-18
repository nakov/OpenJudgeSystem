namespace OJS.Services.Ui.Business.Implementations
{
    using System;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.Judge.Common.Enumerations;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using OJS.Services.Common;
    using OJS.Services.Infrastructure.Exceptions;

    public class SubmissionsBusinessService : ISubmissionsBusinessService
    {
        private readonly ISubmissionsDataService submissionsData;

        private readonly IUsersBusinessService usersBusiness;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IParticipantsDataService participantsDataService;
        private readonly IProblemsDataService problemsDataService;
        private readonly IUserProviderService userProviderService;
        private readonly IContestsBusinessService contestsBusinessService;
        private readonly IProblemsBusinessService problemsBusinessService;
        private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;

        public SubmissionsBusinessService(
            ISubmissionsDataService submissionsData,
            IParticipantScoresDataService participantScoresData,
            IUsersBusinessService usersBusiness,
            IProblemsDataService problemsDataService,
            IParticipantsDataService participantsDataService,
            IUserProviderService userProviderService,
            IContestsBusinessService contestsBusinessService,
            IProblemsBusinessService problemsBusinessService,
            ISubmissionTypesBusinessService submissionTypesBusinessService)
        {
            this.submissionsData = submissionsData;
            this.participantScoresData = participantScoresData;
            this.usersBusiness = usersBusiness;
            this.problemsDataService = problemsDataService;
            this.participantsDataService = participantsDataService;
            this.userProviderService = userProviderService;
            this.contestsBusinessService = contestsBusinessService;
            this.problemsBusinessService = problemsBusinessService;
            this.submissionTypesBusinessService = submissionTypesBusinessService;
        }

        public async Task<SubmissionDetailsServiceModel?> GetById(int submissionId)
            => await this.submissionsData
                .GetByIdQuery(submissionId)
                .MapCollection<SubmissionDetailsServiceModel>()
                .FirstOrDefaultAsync();

        public async Task<SubmissionDetailsServiceModel?> GetDetailsById(int submissionId)
            => await this.submissionsData
                .GetByIdQuery(submissionId)
                .Include(s => s.Participant).ThenInclude(p => p.User)
                .Include(s => s.TestRuns).ThenInclude(tr => tr.Test)
                .MapCollection<SubmissionDetailsServiceModel>()
                .FirstOrDefaultAsync();

        public Task<IQueryable<Submission>> GetAllForArchiving()
        {
            var archiveBestSubmissionsLimit = DateTime.Now.AddYears(
                -GlobalConstants.BestSubmissionEligibleForArchiveAgeInYears);

            var archiveNonBestSubmissionsLimit = DateTime.Now.AddYears(
                -GlobalConstants.NonBestSubmissionEligibleForArchiveAgeInYears);

            return Task.FromResult(this.submissionsData
                .GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
                    archiveBestSubmissionsLimit,
                    archiveNonBestSubmissionsLimit));
        }

        public Task RecalculatePointsByProblem(int problemId)
        {
            using (var scope = TransactionsHelper.CreateTransactionScope())
            {
                var problemSubmissions = this.submissionsData
                    .GetAllByProblem(problemId)
                    .Include(s => s.TestRuns)
                    .Include(s => s.TestRuns.Select(tr => tr.Test))
                    .ToList();

                var submissionResults = problemSubmissions
                    .Select(s => new
                    {
                        s.Id,
                        s.ParticipantId,
                        CorrectTestRuns = s.TestRuns.Count(t =>
                            t.ResultType == TestRunResultType.CorrectAnswer &&
                            !t.Test.IsTrialTest),
                        AllTestRuns = s.TestRuns.Count(t => !t.Test.IsTrialTest),
                        MaxPoints = s.Problem!.MaximumPoints
                    })
                    .ToList();

                var problemSubmissionsById = problemSubmissions.ToDictionary(s => s.Id);
                var topResults = new Dictionary<int, ParticipantScoreModel>();

                foreach (var submissionResult in submissionResults)
                {
                    var submission = problemSubmissionsById[submissionResult.Id];
                    var points = 0;
                    if (submissionResult.AllTestRuns != 0)
                    {
                        points = (submissionResult.CorrectTestRuns * submissionResult.MaxPoints) /
                            submissionResult.AllTestRuns;
                    }

                    submission.Points = points;
                    submission.CacheTestRuns();

                    if (!submissionResult.ParticipantId.HasValue)
                    {
                        continue;
                    }

                    var participantId = submissionResult.ParticipantId.Value;

                    if (!topResults.ContainsKey(participantId) || topResults[participantId].Points < points)
                    {
                        topResults[participantId] = new ParticipantScoreModel
                        {
                            Points = points,
                            SubmissionId = submission.Id
                        };
                    }
                    else if (topResults[participantId].Points == points)
                    {
                        if (topResults[participantId].SubmissionId < submission.Id)
                        {
                            topResults[participantId].SubmissionId = submission.Id;
                        }
                    }
                }

                this.submissionsData.SaveChanges();

                var participants = topResults.Keys.ToList();

                var existingScores = this.participantScoresData
                    .GetAllByProblem(problemId)
                    .Where(p => participants.Contains(p.ParticipantId))
                    .ToList();

                foreach (var existingScore in existingScores)
                {
                    var topScore = topResults[existingScore.ParticipantId];

                    existingScore.Points = topScore.Points;
                    existingScore.SubmissionId = topScore.SubmissionId;
                }

                this.submissionsData.SaveChanges();

                scope.Complete();
            }

            return Task.CompletedTask;
        }

        // public async Task HardDeleteAllArchived() =>
        //     (await this.archivedSubmissionsData
        //         .GetAllUndeletedFromMainDatabase())
        //         .Select(s => s.Id)
        //         .AsEnumerable()
        //         .ChunkBy(GlobalConstants.BatchOperationsChunkSize)
        //         .ForEach(submissionIds =>
        //             this.HardDeleteByArchivedIds(new HashSet<int>(submissionIds)));

        // private Task HardDeleteByArchivedIds(ICollection<int> ids)
        // {
        //     using (var scope = TransactionsHelper.CreateTransactionScope(IsolationLevel.ReadCommitted))
        //     {
        //         this.participantScoresData.RemoveSubmissionIdsBySubmissionIds(ids);
        //         this.submissionsData.Delete(s => ids.Contains(s.Id));
        //
        //         this.archivedSubmissionsData.SetToHardDeletedFromMainDatabaseByIds(ids);
        //
        //         scope.Complete();
        //     }
        //
        //     return Task.CompletedTask;
        // }

        public async Task<IEnumerable<SubmissionForProfileServiceModel>> GetForProfileByUser(string? username)
        {
            var user = await this.usersBusiness.GetUserProfileByUsername(username);
            var data = await this.submissionsData
                .GetQuery()
                .Include(s => s.Problem)
                .Include(s => s.TestRuns)
                .Include(s => s.SubmissionType)
                .Where(s => s.Participant!.UserId == user!.Id)
                .Take(40)
                .OrderByDescending(s => s.CreatedOn)
                .MapCollection<SubmissionForProfileServiceModel>()
                .ToListAsync();

            return data;
        }

        public async Task<IEnumerable<SubmissionResultsServiceModel>> GetSubmissionResultsByProblem(int problemId,
            bool isOfficial)
        {
            var problem = await this.problemsDataService.GetWithProblemGroupById(problemId);

            if (problem == null)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.Problem_not_found);
            }

            var user = this.userProviderService.GetCurrentUser();

            var userHasParticipation = await this.participantsDataService
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
                await this.participantsDataService.GetByContestByUserAndByIsOfficial(problem.ProblemGroup.ContestId, user.Id,
                    isOfficial);

            var userSubmissions = await this.submissionsData
                .GetAllByProblemAndParticipant(problemId, participant.Id)
                .MapCollection<SubmissionResultsServiceModel>()
                .ToListAsync();

            return userSubmissions;
        }

        public async Task Submit(SubmitSubmissionServiceModel model)
        {
            var problem = await this.problemsDataService.GetWithProblemGroupCheckerAndTestsById(model.ProblemId);
            if (problem == null)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.Problem_not_found);
            }

            var currentUser = this.userProviderService.GetCurrentUser();

            var participant = await this.participantsDataService
                .GetWithContestByContestByUserAndIsOfficial(problem.ProblemGroup.ContestId, currentUser.Id, model.Official);
            if (participant == null)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.User_is_not_registered_for_exam);
            }

            await this.contestsBusinessService.ValidateContest(participant.Contest, currentUser.Id, currentUser.IsAdmin, model.Official);

            this.problemsBusinessService.ValidateProblemForParticipant(
                participant,
                participant.Contest,
                model.ProblemId,
                model.Official);

            // if (official &&
            //     !this.contestsBusinessService.IsContestIpValidByContestAndIp(problem.ProblemGroup.ContestId, this.Request.UserHostAddress))
            // {
            //     return this.RedirectToAction("NewContestIp", new { id = problem.ProblemGroup.ContestId });
            // }

            this.submissionTypesBusinessService.ValidateSubmissionType(model.SubmissionTypeId, problem);

            if (this.submissionsData.HasSubmissionTimeLimitPassedForParticipant(participant.Id, participant.Contest.LimitBetweenSubmissions))
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.Submission_was_sent_too_soon);
            }

            if (problem.SourceCodeSizeLimit < model.Content.Length)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.Submission_too_long);
            }

            if (this.submissionsData.HasUserNotProcessedSubmissionForProblem(problem.Id, currentUser.Id))
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.User_has_not_processed_submission_for_problem);
            }

            var contest = participant.Contest;

            var newSubmission = new Submission
            {
                ContentAsString = model.Content,
                ProblemId = model.ProblemId,
                SubmissionTypeId = model.SubmissionTypeId,
                ParticipantId = participant.Id,
                IpAddress = "model.UserHostAddress",
                IsPublic = ((participant.IsOfficial && contest.ContestPassword == null) ||
                                (!participant.IsOfficial && contest.PracticePassword == null)) &&
                            contest.IsVisible &&
                            !contest.IsDeleted &&
                            problem.ShowResults
            };

            await this.submissionsData.Add(newSubmission);
            await this.submissionsData.SaveChanges();

            // newSubmission.Problem = problem;
            // newSubmission.SubmissionType = await this.submissionTypesBusinessService.GetById(newSubmission.SubmissionTypeId.Value);

            // var response = this.submissionsDistributorCommunication.AddSubmissionForProcessing(newSubmission).Result;
            // this.submissionsForProcessingData.AddOrUpdateBySubmission(newSubmission.Id, response.IsSuccess);
        }
    }
}