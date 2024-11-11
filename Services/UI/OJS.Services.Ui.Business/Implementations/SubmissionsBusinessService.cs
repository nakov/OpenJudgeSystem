namespace OJS.Services.Ui.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OJS.Common;
using OJS.Common.Enumerations;
using OJS.Data;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Tests;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Submissions;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using OJS.Services.Ui.Business.Validations.Implementations.Submissions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Participants;
using OJS.Services.Ui.Models.Submissions;
using OJS.Workers.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Ui.Business.Cache;
using static OJS.Services.Common.Constants.PaginationConstants.Submissions;
using static OJS.Services.Ui.Business.Constants.Comments;

public class SubmissionsBusinessService : ISubmissionsBusinessService
{
    private readonly ILogger<SubmissionsBusinessService> logger;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ISubmissionsCommonDataService submissionsCommonData;
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;
    private readonly IUsersBusinessService usersBusiness;
    private readonly IParticipantScoresBusinessService participantScoresBusinessService;
    private readonly ISubmissionsCommonBusinessService submissionsCommonBusinessService;
    private readonly IParticipantsDataService participantsDataService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IUserProviderService userProviderService;
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusiness;
    private readonly ISubmissionDetailsValidationService submissionDetailsValidationService;
    private readonly ISubmitSubmissionValidationService submitSubmissionValidationService;
    private readonly ISubmissionResultsValidationService submissionResultsValidationService;
    private readonly ISubmissionFileDownloadValidationService submissionFileDownloadValidationService;
    private readonly IRetestSubmissionValidationService retestSubmissionValidationService;
    private readonly IPublisherService publisher;
    private readonly ISubmissionsHelper submissionsHelper;
    private readonly IDatesService dates;
    private readonly ITransactionsProvider transactionsProvider;
    private readonly ICacheService cache;
    private readonly IContestsDataService contestsData;
    private readonly ITestsDataService testsData;
    private readonly ISubmissionTypesCacheService submissionTypesCache;
    private readonly ICheckersCacheService checkersCache;
    private readonly ITestRunsDataService testRunsDataService;
    private readonly IContestsCacheService contestsCache;

    public SubmissionsBusinessService(
        ILogger<SubmissionsBusinessService> logger,
        ISubmissionsDataService submissionsData,
        ISubmissionsCommonDataService submissionsCommonData,
        IUsersBusinessService usersBusiness,
        IProblemsDataService problemsDataService,
        IParticipantsDataService participantsDataService,
        ISubmissionsCommonBusinessService submissionsCommonBusinessService,
        IUserProviderService userProviderService,
        IParticipantScoresBusinessService participantScoresBusinessService,
        ILecturersInContestsBusinessService lecturersInContestsBusiness,
        ISubmissionDetailsValidationService submissionDetailsValidationService,
        ISubmitSubmissionValidationService submitSubmissionValidationService,
        ISubmissionResultsValidationService submissionResultsValidationService,
        ISubmissionFileDownloadValidationService submissionFileDownloadValidationService,
        IRetestSubmissionValidationService retestSubmissionValidationService,
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData,
        IPublisherService publisher,
        ISubmissionsHelper submissionsHelper,
        IDatesService dates,
        ITransactionsProvider transactionsProvider,
        ICacheService cache,
        IContestsDataService contestsData,
        ITestsDataService testsData,
        ITestRunsDataService testRunsDataService,
        ISubmissionTypesCacheService submissionTypesCache,
        ICheckersCacheService checkersCache,
        IContestsCacheService contestsCache)
    {
        this.logger = logger;
        this.submissionsData = submissionsData;
        this.submissionsCommonData = submissionsCommonData;
        this.usersBusiness = usersBusiness;
        this.problemsDataService = problemsDataService;
        this.lecturersInContestsBusiness = lecturersInContestsBusiness;
        this.submissionsCommonBusinessService = submissionsCommonBusinessService;
        this.participantsDataService = participantsDataService;
        this.userProviderService = userProviderService;
        this.participantScoresBusinessService = participantScoresBusinessService;
        this.submissionDetailsValidationService = submissionDetailsValidationService;
        this.submitSubmissionValidationService = submitSubmissionValidationService;
        this.submissionResultsValidationService = submissionResultsValidationService;
        this.submissionFileDownloadValidationService = submissionFileDownloadValidationService;
        this.retestSubmissionValidationService = retestSubmissionValidationService;
        this.publisher = publisher;
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.submissionsHelper = submissionsHelper;
        this.dates = dates;
        this.transactionsProvider = transactionsProvider;
        this.cache = cache;
        this.contestsData = contestsData;
        this.testsData = testsData;
        this.testRunsDataService = testRunsDataService;
        this.submissionTypesCache = submissionTypesCache;
        this.checkersCache = checkersCache;
        this.contestsCache = contestsCache;
    }

    public async Task Retest(int submissionId)
    {
        var submission = await this.submissionsData
            .GetSubmissionById<SubmissionDetailsServiceModel>(submissionId);

        if (submission == null)
        {
            throw new BusinessServiceException(ValidationMessages.Submission.NotFound);
        }

        var user = this.userProviderService.GetCurrentUser();

        var testRuns = await this.testRunsDataService
            .GetAllBySubmission(submissionId)
            .AsNoTracking()
            .MapCollection<TestRunDetailsServiceModel>()
            .ToListAsync();

        submission.TestRuns = testRuns;

        submission.Tests = testRuns
            .Select(tr => tr.Test)
            .ToList();

        var userIsAdminOrLecturerInContest = await this.lecturersInContestsBusiness
            .IsCurrentUserAdminOrLecturerInContest(submission.ContestId);

        var validationResult = await this.retestSubmissionValidationService.GetValidationResult((
                submission,
                user,
                userIsAdminOrLecturerInContest));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        await this.publisher.Publish(new RetestSubmissionPubSubModel { Id = submissionId });
    }

    public async Task<SubmissionDetailsServiceModel> GetDetailsById(int submissionId)
    {
        var submissionDetailsServiceModel = await this.submissionsData
            .GetSubmissionById<SubmissionDetailsServiceModel>(submissionId);

        if (submissionDetailsServiceModel == null)
        {
            throw new BusinessServiceException(ValidationMessages.Submission.NotFound);
        }

        var currentUser = this.userProviderService.GetCurrentUser();

        var userIsAdminOrLecturerInContest = await this.lecturersInContestsBusiness
            .IsCurrentUserAdminOrLecturerInContest(submissionDetailsServiceModel.ContestId);
        submissionDetailsServiceModel.UserIsInRoleForContest = userIsAdminOrLecturerInContest;

        var validationResult = this.submissionDetailsValidationService
            .GetValidationResult((submissionDetailsServiceModel, currentUser, userIsAdminOrLecturerInContest));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var testRuns = await this.testRunsDataService
            .GetAllBySubmission(submissionId)
            .AsNoTracking()
            .OrderBy(tr => tr.IsTrialTest)
            .ThenBy(tr => tr.Test.OrderBy)
            .MapCollection<TestRunDetailsServiceModel>()
            .ToListAsync();

        foreach (var testRun in testRuns)
        {
            var test = testRun.Test;
            submissionDetailsServiceModel.Tests.Add(test);

            if (userIsAdminOrLecturerInContest)
            {
                continue;
            }

            var displayShowInput = test is { HideInput: false }
                                   && (test.IsTrialTest
                                       || test.IsOpenTest
                                       || submissionDetailsServiceModel.Problem.ShowDetailedFeedback);

            var showExecutionComment = !string.IsNullOrEmpty(testRun.ExecutionComment)
                                       && (test.IsOpenTest
                                           || test.IsTrialTest
                                           || submissionDetailsServiceModel.Problem.ShowDetailedFeedback);

            if (!showExecutionComment)
            {
                testRun.ExecutionComment = string.Empty;
            }

            if (!displayShowInput)
            {
                testRun.ShowInput = false;
                testRun.Input = string.Empty;
                testRun.ExpectedOutputFragment = string.Empty;
                testRun.UserOutputFragment = string.Empty;
            }
        }

        submissionDetailsServiceModel.TestRuns = testRuns;

        submissionDetailsServiceModel.IsEligibleForRetest = await this.submissionsHelper.IsEligibleForRetest(submissionDetailsServiceModel);

        return submissionDetailsServiceModel;
    }

    public async Task<SubmissionFileDownloadServiceModel> GetSubmissionFile(int submissionId)
    {
        var submissionDetailsServiceModel = await this.submissionsData
            .GetSubmissionById<SubmissionFileDetailsServiceModel>(submissionId);

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

    public Task<Dictionary<SubmissionProcessingState, int>> GetAllUnprocessedCount()
        => this.submissionsForProcessingData
            .GetAllUnprocessed()
            .GroupBy(sfp => sfp.State)
            .ToDictionaryAsync(sfp => sfp.Key, sfp => sfp.Count());

    public async Task<PagedResult<TServiceModel>> GetByUsername<TServiceModel>(
        string? username,
        int page,
        int itemsInPage = DefaultSubmissionsPerPage)
    {
        if (!await this.usersBusiness.IsUserInRolesOrProfileOwner(
                username,
                [GlobalConstants.Roles.Administrator, GlobalConstants.Roles.Lecturer]))
        {
            throw new UnauthorizedAccessException("You are not authorized for this action");
        }

        var userId = await this.usersBusiness.GetUserIdByUsername(username);

        var userParticipantsIds = await this.participantsDataService
            .GetAllByUser(userId)
            .Select(p => p.Id)
            .ToListAsync();

        return await this.submissionsData
            .GetLatestSubmissionsByUserParticipations<TServiceModel>(
                userParticipantsIds,
                itemsInPage,
                page);
    }

    public async Task<PagedResult<TServiceModel>> GetUserSubmissionsByProblem<TServiceModel>(
        int problemId,
        bool isOfficial,
        int page)
    {
        var problem =
            await this.problemsDataService.GetWithProblemGroupById(problemId)
                .Map<ProblemForSubmissionDetailsServiceModel>();

        var user = this.userProviderService.GetCurrentUser();

        var participant = await this.participantsDataService
                .GetByContestByUserAndByIsOfficial(problem.ProblemGroup.ContestId, user.Id!, isOfficial)
                .Map<ParticipantServiceModel>();

        var validationResult =
            this.submissionResultsValidationService.GetValidationResult((user, problem, participant, isOfficial));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        return await this.GetUserSubmissions<TServiceModel>(problem.Id, participant.Id, page);
    }

    public async Task Submit(SubmitSubmissionServiceModel model)
    {
        var problem = await this.problemsDataService.GetWithSubmissionTypesById(model.ProblemId)
            ?? throw new BusinessServiceException(ValidationMessages.Problem.NotFound);

        var checkerId = problem.CheckerId;
        problem.Checker = checkerId.HasValue
            ? await this.checkersCache.GetById(checkerId.Value)
            : null;

        var submissionType = await this.submissionTypesCache.GetById(model.SubmissionTypeId);

        var currentUser = this.userProviderService.GetCurrentUser();

        var participant = await this.participantsDataService
            .GetWithProblemsForParticipantByContestByUserAndIsOfficial(
                model.ContestId,
                currentUser.Id,
                model.Official);

        var contest = await this.contestsCache
            .GetContest(model.ContestId)
            .Map<Contest>();

        var submitSubmissionValidationServiceResult = await this.submitSubmissionValidationService.GetValidationResult(
            (problem, participant, model, contest, submissionType));

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

        newSubmission.ParticipantId = participant!.Id;
        newSubmission.IpAddress = "model.UserHostAddress";
        newSubmission.IsPublic = ((participant.IsOfficial && contest!.ContestPassword == null) ||
                                  (!participant.IsOfficial && contest!.PracticePassword == null)) &&
                                 (contest.IsVisible || contest.VisibleFrom <= this.dates.GetUtcNow()) &&
                                 !contest.IsDeleted &&
                                 problem.ShowResults;

        SubmissionForProcessing? submissionForProcessing = null;
        await this.transactionsProvider.ExecuteInTransaction(async () =>
        {
            if (submissionType!.ExecutionStrategyType
                is ExecutionStrategyType.NotFound
                or ExecutionStrategyType.DoNothing)
            {
                // Submission is just uploaded and should not be processed
                await this.AddNewDefaultProcessedSubmission(participant, newSubmission);
                return;
            }

            await this.submissionsData.Add(newSubmission);
            await this.submissionsData.SaveChanges();

            submissionForProcessing = await this.submissionsForProcessingData.Add(newSubmission.Id);
            await this.submissionsData.SaveChanges();
        });

        problem.Tests = await this.testsData
            .GetAllByProblem(problem.Id)
            .AsNoTracking()
            .ToListAsync();

        var submissionServiceModel =
            this.submissionsCommonBusinessService.BuildSubmissionForProcessing(newSubmission, problem,
                submissionType!);

        await this.submissionsCommonBusinessService.PublishSubmissionForProcessing(submissionServiceModel,
            submissionForProcessing!);
    }

    public async Task ProcessExecutionResult(SubmissionExecutionResult submissionExecutionResult)
    {
        var submission = await this.submissionsData
            .GetByIdQuery(submissionExecutionResult.SubmissionId)
            .IgnoreQueryFilters()
            .Include(s => s.TestRuns)
            .FirstOrDefaultAsync();

        if (submission == null)
        {
            throw new BusinessServiceException(
                $"Submission with Id: \"{submissionExecutionResult.SubmissionId}\" not found.");
        }

        var submissionForProcessing = await this.submissionsForProcessingData
            .GetBySubmission(submission.Id);

        if (submissionForProcessing == null)
        {
            throw new BusinessServiceException(
                $"Submission for processing for Submission with ID {submissionExecutionResult.SubmissionId} not found in the database.");
        }

        var participant = await this.participantsDataService
            .GetByIdQuery(submission.ParticipantId)
            .IgnoreQueryFilters()
            .Include(p => p.User)
            .FirstOrDefaultAsync();

        if (participant == null)
        {
            throw new BusinessServiceException(
                $"Participant with Id: \"{submission.ParticipantId}\" not found.");
        }

        var exception = submissionExecutionResult.Exception;
        var executionResult = submissionExecutionResult.ExecutionResult;

        await this.transactionsProvider.ExecuteInTransaction(async () =>
        {
            submission.Processed = true;
            submission.ProcessingComment = null;
            submission.StartedExecutionOn = submissionExecutionResult.StartedExecutionOn;
            submission.CompletedExecutionOn = submissionExecutionResult.CompletedExecutionOn;
            submission.WorkerName = submissionExecutionResult.WorkerName;

            if (executionResult != null)
            {
                ProcessTestsExecutionResult(submission, executionResult);
                await this.SaveParticipantScore(participant, submission);
                CacheTestRuns(submission);
            }
            else
            {
                submission.IsCompiledSuccessfully = false;
                var errorMessage = exception?.Message
                    ?? "Invalid execution result received. Please contact an administrator.";
                submission.ProcessingComment = errorMessage;
                submission.CompilerComment = ProcessingExceptionCompilerComment;
            }

            await this.submissionsForProcessingData.SetProcessingState(submissionForProcessing, SubmissionProcessingState.Processed);
        });

        this.logger.LogSubmissionProcessedSuccessfully(submission.Id, submissionForProcessing);
    }

    public Task<int> GetTotalCount()
        => this.cache.Get(
            CacheConstants.TotalSubmissionsCount,
            async () => await this.submissionsData.IgnoreQueryFilters().Count(),
            CacheConstants.FiveMinutesInSeconds);

    public async Task<PagedResult<TServiceModel>> GetSubmissions<TServiceModel>(
        SubmissionStatus status,
        int page,
        int itemsPerPage = DefaultSubmissionsPerPage)
    {
        if (itemsPerPage <= 0)
        {
            throw new BusinessServiceException("Invalid submissions per page count");
        }

        IQueryable<Submission> query;

        switch (status)
        {
            case SubmissionStatus.Enqueued:
                query = this.submissionsCommonData.GetAllEnqueued();
                break;
            case SubmissionStatus.Processing:
                query = this.submissionsCommonData.GetAllProcessing();
                break;
            case SubmissionStatus.Pending:
                query = this.submissionsCommonData.GetAllPending();
                break;
            case SubmissionStatus.All:
            default:
                return this.userProviderService.GetCurrentUser().IsAdminOrLecturer
                    ? await this.submissionsData
                        .GetLatestSubmissions<TServiceModel>()
                        .ToPagedResultAsync(itemsPerPage, page)
                    : await this.cache.Get(
                        CacheConstants.LatestPublicSubmissions,
                        async () =>
                        {
                            var submissions = await this.submissionsData
                                .GetLatestSubmissions<TServiceModel>(DefaultSubmissionsPerPage)
                                .ToListAsync();

                            var totalItemsCount = await this.GetTotalCount();

                            // Public submissions do not have pagination, but PagedResult is used for consistency.
                            return new PagedResult<TServiceModel>
                            {
                                Items = submissions,
                                TotalItemsCount = totalItemsCount,
                                PageNumber = 1,
                            };
                        },
                        CacheConstants.TwoMinutesInSeconds);
        }

        return await query
            .OrderByDescending(s => s.Id)
            .MapCollection<TServiceModel>()
            .ToPagedResultAsync(itemsPerPage, page);
    }

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

        submission.TestRuns = (executionResult.TaskResult?.TestResults ?? []).Select(testResult => new TestRun
        {
            ResultType = testResult.ResultType,
            CheckerComment = testResult.CheckerDetails?.Comment,
            ExecutionComment = testResult.ExecutionComment,
            ExpectedOutputFragment = testResult.CheckerDetails?.ExpectedOutputFragment,
            UserOutputFragment = testResult.CheckerDetails?.UserOutputFragment,
            IsTrialTest = testResult.IsTrialTest,
            TimeUsed = testResult.TimeUsed,
            MemoryUsed = testResult.MemoryUsed,
            SubmissionId = submission.Id,
            TestId = testResult.Id,
        }).ToList();
    }


    private static void HandleProcessingException(Submission submission, Exception ex, string methodName)
    {
        submission.ProcessingComment = string.Format(ProcessingException, methodName, ex.Message);
        submission.IsCompiledSuccessfully = false;
        submission.CompilerComment = ProcessingExceptionCompilerComment;
        submission.TestRuns = new List<TestRun>();
    }

    private static void CacheTestRuns(Submission submission)
    {
        try
        {
            submission.CacheTestRuns();
        }
        catch (Exception ex)
        {
            HandleProcessingException(submission, ex, nameof(CacheTestRuns));
        }
    }

    private async Task AddNewDefaultProcessedSubmission(Participant participant, Submission submission)
    {
        submission.Processed = true;
        submission.IsCompiledSuccessfully = true;
        submission.Points = 0;

        await this.submissionsData.Add(submission);
        await this.submissionsData.SaveChanges();

        await this.participantScoresBusinessService.SaveForSubmission(participant, submission);
    }

    private async Task SaveParticipantScore(Participant participant, Submission submission)
    {
        try
        {
            await this.participantScoresBusinessService.SaveForSubmission(participant, submission);
        }
        catch (Exception ex)
        {
            HandleProcessingException(submission, ex, nameof(this.SaveParticipantScore));
        }
    }

    private async Task<PagedResult<TServiceModel>> GetUserSubmissions<TServiceModel>(
        int problemId,
        int participantId,
        int page)
        => await this.submissionsData
            .GetAllByProblemAndParticipant(problemId, participantId)
            .MapCollection<TServiceModel>()
            .ToPagedResultAsync(DefaultSubmissionResultsPerPage, page);
}