namespace OJS.Services.Ui.Business.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Common;
using OJS.Common.Helpers;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Tests;
using OJS.Services.Common;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Ui.Business.Validation;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using SoftUni.Judge.Common.Enumerations;
using static OJS.Services.Ui.Business.Constants.PublicSubmissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsBusinessService : ISubmissionsBusinessService
{
    private readonly ISubmissionsDataService submissionsData;
    private readonly IUsersBusinessService usersBusiness;
    private readonly IParticipantScoresBusinessService participantScoresBusinessService;
    private readonly IParticipantsDataService participantsDataService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IUserProviderService userProviderService;
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;
    private readonly ISubmissionsDistributorCommunicationService submissionsDistributorCommunicationService;
    private readonly ITestRunsDataService testRunsDataService;
    private readonly ISubmissionDetailsValidationService submissionDetailsValidationService;
    private readonly IContestValidationService contestValidationService;
    private readonly ISubmitSubmissionValidationService submitSubmissionValidationService;
    private readonly ISubmissionResultsValidationService submissionResultsValidationService;

    public SubmissionsBusinessService(
        ISubmissionsDataService submissionsData,
        IUsersBusinessService usersBusiness,
        IProblemsDataService problemsDataService,
        IParticipantsDataService participantsDataService,
        IUserProviderService userProviderService,
        IContestsBusinessService contestsBusinessService,
        IProblemsBusinessService problemsBusinessService,
        ISubmissionTypesBusinessService submissionTypesBusinessService,
        ISubmissionsDistributorCommunicationService submissionsDistributorCommunicationService,
        ITestRunsDataService testRunsDataService,
        IParticipantScoresBusinessService participantScoresBusinessService,
        ISubmissionDetailsValidationService submissionDetailsValidationService,
        IContestValidationService contestValidationService,
        ISubmitSubmissionValidationService submitSubmissionValidationService,
        ISubmissionResultsValidationService submissionResultsValidationService)
    {
        this.submissionsData = submissionsData;
        this.usersBusiness = usersBusiness;
        this.problemsDataService = problemsDataService;
        this.participantsDataService = participantsDataService;
        this.userProviderService = userProviderService;
        this.contestsBusinessService = contestsBusinessService;
        this.problemsBusinessService = problemsBusinessService;
        this.submissionTypesBusinessService = submissionTypesBusinessService;
        this.submissionsDistributorCommunicationService = submissionsDistributorCommunicationService;
        this.testRunsDataService = testRunsDataService;
        this.participantScoresBusinessService = participantScoresBusinessService;
        this.submissionDetailsValidationService = submissionDetailsValidationService;
        this.contestValidationService = contestValidationService;
        this.submitSubmissionValidationService = submitSubmissionValidationService;
        this.submissionResultsValidationService = submissionResultsValidationService;
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

        var validationResult = this.submissionDetailsValidationService.GetValidationResult((submissionDetailsServiceModel, currentUser) !);

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        return submissionDetailsServiceModel!;
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
        var problem = await this.problemsDataService.GetWithProblemGroupById(problemId);
        var user = this.userProviderService.GetCurrentUser();

        var participant =
            await this.participantsDataService.GetByContestByUserAndByIsOfficial(
                problem!.ProblemGroup.ContestId,
                user.Id!,
                isOfficial);

        var validationResult = this.submissionResultsValidationService.GetValidationResult((user, problem, participant));
        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var userSubmissions = user.IsAdminOrLecturer
            ? this.submissionsData
                .GetAllByProblem(problemId)
                .MapCollection<SubmissionResultsServiceModel>()
            : this.submissionsData
                .GetAllByProblemAndParticipant(problemId, participant!.Id)
                .MapCollection<SubmissionResultsServiceModel>();

        if (take != 0)
        {
            userSubmissions = userSubmissions.Take(take);
        }

        return await userSubmissions.ToListAsync();
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
        var userSubmissionTimeLimit = this.submissionsData.GetUserSubmissionTimeLimit(
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
            throw new BusinessServiceException(submitSubmissionValidationServiceResult.Message);
        }

        var newSubmission = model.Map<Submission>();
        newSubmission.ParticipantId = participant.Id;
        newSubmission.IpAddress = "model.UserHostAddress";
        newSubmission.IsPublic = ((participant.IsOfficial && participant.Contest.ContestPassword == null) ||
                                  (!participant.IsOfficial && participant.Contest.PracticePassword == null)) &&
                                 participant.Contest.IsVisible &&
                                 !participant.Contest.IsDeleted &&
                                 problem.ShowResults;

        await this.submissionsData.Add(newSubmission);
        await this.submissionsData.SaveChanges();

        newSubmission.Problem = problem;
        newSubmission.SubmissionType =
            problem.SubmissionTypesInProblems
                .First(st => st.SubmissionTypeId == model.SubmissionTypeId)
                .SubmissionType;

        await this.submissionsDistributorCommunicationService.AddSubmissionForProcessing(newSubmission);
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

        var exception = submissionExecutionResult.Exception;
        var executionResult = submissionExecutionResult.ExecutionResult;

        submission.ProcessingComment = null;
        await this.testRunsDataService.DeleteBySubmission(submission.Id);

        if (exception != null)
        {
            submission.ProcessingComment = exception.Message + Environment.NewLine + exception.StackTrace;
            return;
        }

        if (executionResult == null)
        {
            submission.ProcessingComment = "Invalid execution result received. Please contact an administrator.";
            return;
        }

        await this.ProcessTestsExecutionResult(submission, executionResult);
    }

    public Task<IEnumerable<SubmissionForPublicSubmissionsServiceModel>> GetPublicSubmissions()
        => this.submissionsData.GetLatestSubmissions<SubmissionForPublicSubmissionsServiceModel>(DefaultCount);

    public Task<int> GetTotalCount()
        => this.submissionsData.Count();

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

    private async Task ProcessTestsExecutionResult(
        Submission submission,
        ExecutionResultResponseModel executionResult)
    {
        submission.IsCompiledSuccessfully = executionResult.IsCompiledSuccessfully;
        submission.CompilerComment = executionResult.CompilerComment;
        submission.Points = executionResult.TaskResult.Points;

        if (!executionResult.IsCompiledSuccessfully)
        {
            await this.UpdateResults(submission);
        }

        var testResults = executionResult
                              .TaskResult
                              ?.TestResults
                          ?? Enumerable.Empty<TestResultResponseModel>();

        submission.TestRuns.AddRange(testResults.Select(testResult =>
            new TestRun
            {
                CheckerComment = testResult.CheckerDetails.Comment,
                ExpectedOutputFragment = testResult.CheckerDetails.ExpectedOutputFragment,
                UserOutputFragment = testResult.CheckerDetails.UserOutputFragment,
                ExecutionComment = testResult.ExecutionComment,
                MemoryUsed = testResult.MemoryUsed,
                ResultType = (TestRunResultType)Enum.Parse(typeof(TestRunResultType), testResult.ResultType),
                TestId = testResult.Id,
                TimeUsed = testResult.TimeUsed,
            }));

        submission.Processed = true;
        this.submissionsData.Update(submission);
        await this.submissionsData.SaveChanges();

        await this.UpdateResults(submission);
    }

    private async Task UpdateResults(Submission submission)
    {
        await this.SaveParticipantScore(submission);

        CacheTestRuns(submission);
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
}