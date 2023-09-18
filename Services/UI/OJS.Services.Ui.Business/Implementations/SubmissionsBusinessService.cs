namespace OJS.Services.Ui.Business.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OJS.Common;
using OJS.Common.Helpers;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Tests;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Users;
using OJS.Services.Ui.Business.Validations.Implementations.Submissions;
using Infrastructure.Exceptions;
using Data;
using Models.Submissions;
using SoftUni.Common.Models;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Threading.Tasks;
using SoftUni.Common.Extensions;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Infrastructure.Extensions;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Common.Models.Submissions;
using OJS.Workers.Common.Models;
using Microsoft.Extensions.Logging;
using static Constants.PublicSubmissions;

public class SubmissionsBusinessService : ISubmissionsBusinessService
{
    private readonly ISubmissionsDataService submissionsData;
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;
    private readonly IUsersBusinessService usersBusiness;
    private readonly IParticipantScoresBusinessService participantScoresBusinessService;

    private readonly IParticipantsBusinessService participantsBusinessService;

    private readonly ISubmissionsCommonBusinessService submissionsCommonBusinessService;

    // TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/624
    private readonly IParticipantsDataService participantsDataService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsDataService contestsDataService;
    private readonly IUserProviderService userProviderService;
    private readonly ISubmissionDetailsValidationService submissionDetailsValidationService;
    private readonly IContestValidationService contestValidationService;
    private readonly ISubmitSubmissionValidationService submitSubmissionValidationService;
    private readonly ISubmissionResultsValidationService submissionResultsValidationService;
    private readonly ISubmissionFileDownloadValidationService submissionFileDownloadValidationService;
    private readonly ISubmissionPublisherService submissionPublisher;
    private readonly ILogger<SubmissionsBusinessService> logger;

    public SubmissionsBusinessService(
        ISubmissionsDataService submissionsData,
        IUsersBusinessService usersBusiness,
        IProblemsDataService problemsDataService,
        IParticipantsBusinessService participantsBusinessService,
        IParticipantsDataService participantsDataService,
        ISubmissionsCommonBusinessService submissionsCommonBusinessService,
        IUserProviderService userProviderService,
        IParticipantScoresBusinessService participantScoresBusinessService,
        ISubmissionDetailsValidationService submissionDetailsValidationService,
        IContestValidationService contestValidationService,
        ISubmitSubmissionValidationService submitSubmissionValidationService,
        ISubmissionResultsValidationService submissionResultsValidationService,
        ISubmissionFileDownloadValidationService submissionFileDownloadValidationService,
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData,
        ISubmissionPublisherService submissionPublisher,
        IContestsDataService contestsDataService,
        ILogger<SubmissionsBusinessService> logger)
    {
        this.submissionsData = submissionsData;
        this.usersBusiness = usersBusiness;
        this.problemsDataService = problemsDataService;
        this.participantsBusinessService = participantsBusinessService;
        this.submissionsCommonBusinessService = submissionsCommonBusinessService;
        this.participantsDataService = participantsDataService;
        this.userProviderService = userProviderService;
        this.participantScoresBusinessService = participantScoresBusinessService;
        this.submissionDetailsValidationService = submissionDetailsValidationService;
        this.contestValidationService = contestValidationService;
        this.submitSubmissionValidationService = submitSubmissionValidationService;
        this.submissionResultsValidationService = submissionResultsValidationService;
        this.submissionFileDownloadValidationService = submissionFileDownloadValidationService;
        this.submissionPublisher = submissionPublisher;
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.contestsDataService = contestsDataService;
        this.logger = logger;
    }

    public async Task<SubmissionDetailsServiceModel?> GetById(int submissionId)
        => await this.submissionsData
            .GetByIdQuery(submissionId)
            .MapCollection<SubmissionDetailsServiceModel>()
            .FirstOrDefaultAsync();

    public async Task<SubmissionDetailsServiceModel> GetDetailsById(int submissionId)
    {
        var currentUser = this.userProviderService.GetCurrentUser();

        var submissionDetailsServiceModel = await this.submissionsData
            .GetByIdQuery(submissionId)
            .Include(s => s.Participant)
            .ThenInclude(p => p!.User)
            .Include(s => s.TestRuns)
            .ThenInclude(tr => tr.Test)
            .Include(s => s.SubmissionType)
            .MapCollection<SubmissionDetailsServiceModel>()
            .FirstOrDefaultAsync();

        var validationResult =
            this.submissionDetailsValidationService.GetValidationResult((submissionDetailsServiceModel, currentUser) !);

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var contest = await this.contestsDataService
            .GetByProblemId<ContestServiceModel>(submissionDetailsServiceModel!.Problem.Id).Map<Contest>();
        var userIsAdminOrLecturerInContest = currentUser.IsAdmin || IsUserLecturerInContest(contest, currentUser.Id!);

        if (!userIsAdminOrLecturerInContest)
        {
            submissionDetailsServiceModel.TestRuns = submissionDetailsServiceModel.TestRuns.Select(tr =>
            {
                var currentTestRunTest = submissionDetailsServiceModel.Tests.FirstOrDefault(t => t.Id == tr.TestId);
                if (!tr.IsTrialTest
                    && ((currentTestRunTest != null &&
                         (currentTestRunTest.HideInput || !currentTestRunTest.IsOpenTest))
                        || submissionDetailsServiceModel.Problem.ShowDetailedFeedback))
                {
                    tr.ShowInput = false;
                    tr.Input = string.Empty;
                    tr.ExecutionComment = string.Empty;
                    tr.ExpectedOutputFragment = string.Empty;
                    tr.UserOutputFragment = string.Empty;
                }

                return tr;
            });
        }

        return submissionDetailsServiceModel!;
    }

    public SubmissionFileDownloadServiceModel GetSubmissionFile(int submissionId)
    {
        var submissionDetailsServiceModel = this.submissionsData
            .GetSubmissionById<SubmissionDetailsServiceModel>(submissionId);

        var currentUser = this.userProviderService.GetCurrentUser();

        var validationResult =
            this.submissionFileDownloadValidationService.GetValidationResult((submissionDetailsServiceModel!,
                currentUser));
        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        return new SubmissionFileDownloadServiceModel
        {
            Content = submissionDetailsServiceModel!.ByteContent,
            MimeType = GlobalConstants.MimeTypes.ApplicationOctetStream,
            FileName = string.Format(
                GlobalConstants.Submissions.SubmissionDownloadFileName,
                submissionDetailsServiceModel.Id,
                submissionDetailsServiceModel.FileExtension),
        };
    }

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

    public async Task RecalculatePointsByProblem(int problemId)
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
                    MaxPoints = s.Problem!.MaximumPoints,
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
                        Points = points, SubmissionId = submission.Id,
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

            await this.submissionsData.SaveChanges();

            var participants = topResults.Keys.ToList();

            var existingScores =
                await this.participantScoresBusinessService.GetByProblemForParticipants(participants, problemId);

            foreach (var existingScore in existingScores)
            {
                var topScore = topResults[existingScore.ParticipantId];

                existingScore.Points = topScore.Points;
                existingScore.SubmissionId = topScore.SubmissionId;
            }

            await this.submissionsData.SaveChanges();

            scope.Complete();
        }
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

    public async Task<IEnumerable<SubmissionResultsServiceModel>> GetSubmissionResultsByProblem(
        int problemId,
        bool isOfficial,
        int take = 0)
    {
        var problem =
            await this.problemsDataService.GetWithProblemGroupById(problemId)
                .Map<ProblemForSubmissionDetailsServiceModel>();
        var user = this.userProviderService.GetCurrentUser();

        var participant =
            await this.participantsDataService.GetByContestByUserAndByIsOfficial(
                    problem.ProblemGroup.ContestId, user.Id!, isOfficial)
                .Map<ParticipantSubmissionResultsServiceModel>();

        this.ValidateCanViewSubmissionResults(isOfficial, user, problem, participant);

        return await this.GetUserSubmissions(problem.Id, participant, take);
    }

    public async Task<IEnumerable<SubmissionResultsServiceModel>> GetSubmissionDetailsResults(
        int submissionId,
        bool isOfficial,
        int take = 0)
    {
        var problem =
            await this.submissionsData.GetProblemBySubmission<ProblemForSubmissionDetailsServiceModel>(submissionId);
        var user = this.userProviderService.GetCurrentUser();

        var participant =
            await this.submissionsData.GetParticipantBySubmission<ParticipantSubmissionResultsServiceModel>(
                submissionId);

        this.ValidateCanViewSubmissionResults(isOfficial, user, problem, participant);

        return await this.GetUserSubmissions(problem.Id, participant, take);
    }

    public async Task Submit(SubmitSubmissionServiceModel model)
    {
        var problem = await this.problemsDataService.GetWithProblemGroupCheckerAndTestsById(model.ProblemId);
        if (problem == null)
        {
            throw new BusinessServiceException(ValidationMessages.Problem.NotFound);
        }

        var currentUser = this.userProviderService.GetCurrentUser();
        var participant = await this.participantsDataService
            .GetWithContestByContestByUserAndIsOfficial(
                problem.ProblemGroup.ContestId,
                currentUser.Id!,
                model.Official);

        var contestValidationResult = this.contestValidationService.GetValidationResult(
            (participant?.Contest,
                participant?.ContestId,
                currentUser.Id,
                currentUser.IsAdminOrLecturer,
                model.Official) !);

        var userSubmissionTimeLimit = await this.participantsBusinessService.GetParticipantLimitBetweenSubmissions(
            participant!.Id,
            participant.Contest.LimitBetweenSubmissions);

        var hasUserNotProcessedSubmissionForProblem =
            this.submissionsData.HasUserNotProcessedSubmissionForProblem(problem.Id, currentUser.Id!);

        var submitSubmissionValidationServiceResult = this.submitSubmissionValidationService.GetValidationResult(
            (problem,
                currentUser,
                participant,
                contestValidationResult,
                userSubmissionTimeLimit,
                hasUserNotProcessedSubmissionForProblem,
                model));

        if (!submitSubmissionValidationServiceResult.IsValid)
        {
            throw new BusinessServiceException(
                submitSubmissionValidationServiceResult.Message,
                JsonConvert.SerializeObject(new { ProblemId = submitSubmissionValidationServiceResult.PropertyName }));
        }

        var newSubmission = model.Map<Submission>();
        if (model.StringContent != null)
        {
            newSubmission.ContentAsString = model.StringContent;
        }
        else
        {
            newSubmission.Content = model.ByteContent!;
        }

        newSubmission.ParticipantId = participant.Id;
        newSubmission.IpAddress = "model.UserHostAddress";
        newSubmission.IsPublic = ((participant.IsOfficial && participant.Contest.ContestPassword == null) ||
                                  (!participant.IsOfficial && participant.Contest.PracticePassword == null)) &&
                                 participant.Contest.IsVisible &&
                                 !participant.Contest.IsDeleted &&
                                 problem.ShowResults;

        var submissionType = problem.SubmissionTypesInProblems
            .First(st => st.SubmissionTypeId == model.SubmissionTypeId)
            .SubmissionType;

        SubmissionServiceModel submissionServiceModel;
        using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        if (submissionType.ExecutionStrategyType is ExecutionStrategyType.NotFound or ExecutionStrategyType.DoNothing)
        {
            // Submission is just uploaded and should not be processed
            await this.AddNewDefaultProcessedSubmission(newSubmission);

            scope.Complete();
            return;
        }

        await this.submissionsData.Add(newSubmission);
        await this.submissionsData.SaveChanges();

        submissionServiceModel = this.BuildSubmissionForProcessing(newSubmission, problem, submissionType);
        await this.submissionsForProcessingData.Add(newSubmission.Id, submissionServiceModel.ToJson());
        await this.submissionsData.SaveChanges();

        scope.Complete();
        scope.Dispose();

        await this.submissionsCommonBusinessService
            .PublishSubmissionForProcessing(submissionServiceModel);
    }

    public async Task ProcessExecutionResult(SubmissionExecutionResult submissionExecutionResult)
    {
        var submission = await this.submissionsData
            .GetByIdQuery(submissionExecutionResult.SubmissionId)
            .Include(s => s.Problem!.Tests)
            .FirstOrDefaultAsync();

        if (submission == null)
        {
            throw new BusinessServiceException(
                $"Submission with Id: \"{submissionExecutionResult.SubmissionId}\" not found.");
        }

        submission.StartedExecutionOn = submissionExecutionResult.ExecutionResult?.StartedExecutionOn;
        submission.CompletedExecutionOn = submissionExecutionResult.ExecutionResult?.CompletedExecutionOn;

        var exception = submissionExecutionResult.Exception;
        var executionResult = submissionExecutionResult.ExecutionResult;

        submission.Processed = true;
        submission.ProcessingComment = null;

        var serializedExecutionResultServiceModel =
            submissionExecutionResult.Map<SerializedSubmissionExecutionResultServiceModel>();
        using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        if (executionResult != null)
        {
            ProcessTestsExecutionResult(submission, executionResult);

            this.submissionsData.Update(submission);

            await this.SaveParticipantScore(submission);

            await this.submissionsForProcessingData.MarkProcessed(serializedExecutionResultServiceModel);
            await this.submissionsData.SaveChanges();
            CacheTestRuns(submission);
        }
        else
        {
            submission.IsCompiledSuccessfully = false;
            var errorMessage = exception?.Message
                               ?? "Invalid execution result received. Please contact an administrator.";
            submission.ProcessingComment = errorMessage;
            submission.CompilerComment = errorMessage;

            this.submissionsData.Update(submission);
            await this.submissionsForProcessingData.MarkProcessed(serializedExecutionResultServiceModel);
        }

        await this.submissionsData.SaveChanges();

        scope.Complete();
        scope.Dispose();
    }

    public async Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetPublicSubmissions(
        SubmissionForPublicSubmissionsServiceModel model)
    {
        var user = this.userProviderService.GetCurrentUser();

        if (user.IsAdminOrLecturer)
        {
            return await this.submissionsData.GetLatestSubmissions<SubmissionForPublicSubmissionsServiceModel>(
                DefaultSubmissionsPerPage, model.PageNumber);
        }

        var modelResult = new PagedResult<SubmissionForPublicSubmissionsServiceModel>();

        modelResult.Items = await this.submissionsData.GetLatestSubmissions<SubmissionForPublicSubmissionsServiceModel>(
            DefaultSubmissionsPerPage);

        return modelResult;
    }

    public async Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetUsersLastSubmissions(
        bool? isOfficial,
        int page)
    {
        var user = this.userProviderService.GetCurrentUser();

        var userParticipantsIdsQuery = this.participantsDataService
            .GetAllByUser(user.Id);

        if (isOfficial.HasValue)
        {
            userParticipantsIdsQuery = userParticipantsIdsQuery.Where(p => p.IsOfficial == isOfficial);
        }

        var ids = await userParticipantsIdsQuery
            .Select(p => p.Id)
            .ToEnumerableAsync();

        return await this.submissionsData
            .GetLatestSubmissionsByUserParticipations<SubmissionForPublicSubmissionsServiceModel>(
                ids.MapCollection<int?>(),
                DefaultSubmissionsPerPage,
                page);
    }

    public async Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetProcessingSubmissions(int page)
    {
        var submissionsForProcessing =
            await this.submissionsForProcessingData
                .GetAllProcessing<SubmissionForProcessingServiceModel>();

        if (submissionsForProcessing.IsEmpty())
        {
            return new PagedResult<SubmissionForPublicSubmissionsServiceModel>();
        }

        var submissions = this.submissionsData
            .GetAllByIdsQuery(
                submissionsForProcessing
                    .Select(sp => sp.SubmissionId));

        return submissions
            .MapCollection<SubmissionForPublicSubmissionsServiceModel>()
            .ToPagedResult(DefaultSubmissionsPerPage, page);
    }

    public async Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetByContest(int contestId, int page)
    {
        var user = this.userProviderService.GetCurrentUser();

        return await this.submissionsData
            .GetAllForUserByContest(
                contestId,
                user.Id)
            .MapCollection<SubmissionForPublicSubmissionsServiceModel>()
            .ToPagedResultAsync(DefaultSubmissionsPerPage, page);
    }

    public async Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetPendingSubmissions(int page)
    {
        var pendingSubmissions = await this.submissionsForProcessingData
            .GetAllPending()
            .ToListAsync();

        if (pendingSubmissions.IsEmpty())
        {
            return new PagedResult<SubmissionForPublicSubmissionsServiceModel>();
        }

        var submissions = this.submissionsData
            .GetAllByIdsQuery(
                pendingSubmissions
                    .Select(sp => sp!.SubmissionId));

        return submissions
            .MapCollection<SubmissionForPublicSubmissionsServiceModel>()
            .ToPagedResult(DefaultSubmissionsPerPage, page);
    }

    public Task<int> GetTotalCount()
        => this.submissionsData.GetTotalSubmissionsCount();

    private static bool IsUserLecturerInContest(Contest contest, string userId) =>
        contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
        contest.Category!.LecturersInContestCategories.Any(cl => cl.LecturerId == userId);

    private static void ProcessTestsExecutionResult(
        Submission submission,
        ExecutionResultServiceModel executionResult)
    {
        submission.IsCompiledSuccessfully = executionResult.IsCompiledSuccessfully;
        submission.CompilerComment = executionResult.CompilerComment;
        submission.Points = executionResult.TaskResult!.Points;

        if (!executionResult.IsCompiledSuccessfully)
        {
            submission.TestRuns.Clear();
            return;
        }

        var testResults =
            executionResult.TaskResult?.TestResults ?? Enumerable.Empty<TestResultServiceModel>();

        submission.TestRuns.AddRange(
            testResults.Select(testResult => testResult.Map<TestRun>()));
    }

    private static void CacheTestRuns(Submission submission)
    {
        try
        {
            submission.CacheTestRuns();
        }
        catch (Exception ex)
        {
            submission.ProcessingComment = $"Exception in CacheTestRuns: {ex.Message}";
        }
    }

    private SubmissionServiceModel BuildSubmissionForProcessing(
        Submission submission,
        Problem problem,
        SubmissionType submissionType)
    {
        // We detach the existing entity, in order to avoid tracking exception on Update.
        this.submissionsData.Detach(submission);

        // Needed to map execution details
        submission.Problem = problem;
        submission.SubmissionType = submissionType;

        var serviceModel = submission.Map<SubmissionServiceModel>();

        serviceModel.TestsExecutionDetails!.TaskSkeleton = problem.SubmissionTypesInProblems
            .Where(x => x.SubmissionTypeId == submission.SubmissionTypeId)
            .Select(x => x.SolutionSkeleton)
            .FirstOrDefault();

        return serviceModel;
    }

    private async Task AddNewDefaultProcessedSubmission(Submission submission)
    {
        submission.Processed = true;
        submission.Points = 0;

        await this.submissionsData.Add(submission);
        await this.submissionsData.SaveChanges();

        await this.participantScoresBusinessService.SaveForSubmission(submission);
    }

    private async Task SaveParticipantScore(Submission submission)
    {
        try
        {
            await this.participantScoresBusinessService.SaveForSubmission(submission);
        }
        catch (Exception ex)
        {
            submission.ProcessingComment = $"Exception in SaveParticipantScore: {ex.Message}";
        }
    }

    private async Task<IEnumerable<SubmissionResultsServiceModel>> GetUserSubmissions(
        int problemId,
        ParticipantSubmissionResultsServiceModel? participant,
        int take)
    {
        var userSubmissions = this.submissionsData
            .GetAllByProblemAndParticipant(problemId, participant!.Id)
            .Take(take);

        return await userSubmissions
            .MapCollection<SubmissionResultsServiceModel>()
            .ToListAsync();
    }

    private void ValidateCanViewSubmissionResults(
        bool isOfficial,
        UserInfoModel user,
        ProblemForSubmissionDetailsServiceModel? problem,
        ParticipantSubmissionResultsServiceModel? participant)
    {
        var validationResult =
            this.submissionResultsValidationService.GetValidationResult((user, problem, participant, isOfficial));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }
    }
}