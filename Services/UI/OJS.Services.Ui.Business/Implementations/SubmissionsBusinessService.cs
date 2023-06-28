namespace OJS.Services.Ui.Business.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Common;
using OJS.Common;
using OJS.Common.Helpers;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Tests;
using OJS.Services.Common.Models.Users;
using OJS.Services.Ui.Business.Validations.Implementations.Submissions;
using Infrastructure;
using Infrastructure.Exceptions;
using Validation;
using Data;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using SoftUni.Judge.Common.Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using static Constants.PublicSubmissions;

public class SubmissionsBusinessService : ISubmissionsBusinessService
{
    private readonly ISubmissionsDataService submissionsData;
    private readonly IUsersBusinessService usersBusiness;
    private readonly IParticipantScoresBusinessService participantScoresBusinessService;
    private readonly IParticipantsBusinessService participantsBusinessService;
    // TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/624
    private readonly IParticipantsDataService participantsDataService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IUserProviderService userProviderService;
    private readonly ISubmissionsDistributorCommunicationService submissionsDistributorCommunicationService;
    private readonly ITestRunsDataService testRunsDataService;
    private readonly ISubmissionDetailsValidationService submissionDetailsValidationService;
    private readonly IContestValidationService contestValidationService;
    private readonly ISubmitSubmissionValidationService submitSubmissionValidationService;
    private readonly ISubmissionResultsValidationService submissionResultsValidationService;
    private readonly ISubmissionFileDownloadValidationService submissionFileDownloadValidationService;

    public SubmissionsBusinessService(
        ISubmissionsDataService submissionsData,
        IUsersBusinessService usersBusiness,
        IProblemsDataService problemsDataService,
        IParticipantsBusinessService participantsBusinessService,
        IParticipantsDataService participantsDataService,
        IUserProviderService userProviderService,
        ISubmissionsDistributorCommunicationService submissionsDistributorCommunicationService,
        ITestRunsDataService testRunsDataService,
        IParticipantScoresBusinessService participantScoresBusinessService,
        ISubmissionDetailsValidationService submissionDetailsValidationService,
        IContestValidationService contestValidationService,
        ISubmitSubmissionValidationService submitSubmissionValidationService,
        ISubmissionResultsValidationService submissionResultsValidationService,
        ISubmissionFileDownloadValidationService submissionFileDownloadValidationService)
    {
        this.submissionsData = submissionsData;
        this.usersBusiness = usersBusiness;
        this.problemsDataService = problemsDataService;
        this.participantsBusinessService = participantsBusinessService;
        this.participantsDataService = participantsDataService;
        this.userProviderService = userProviderService;
        this.submissionsDistributorCommunicationService = submissionsDistributorCommunicationService;
        this.testRunsDataService = testRunsDataService;
        this.participantScoresBusinessService = participantScoresBusinessService;
        this.submissionDetailsValidationService = submissionDetailsValidationService;
        this.contestValidationService = contestValidationService;
        this.submitSubmissionValidationService = submitSubmissionValidationService;
        this.submissionResultsValidationService = submissionResultsValidationService;
        this.submissionFileDownloadValidationService = submissionFileDownloadValidationService;
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

    public SubmissionFileDownloadServiceModel GetSubmissionFile(int submissionId)
    {
        var submissionDetailsServiceModel = this.submissionsData
            .GetSubmissionById<SubmissionDetailsServiceModel>(submissionId);

        var currentUser = this.userProviderService.GetCurrentUser();

        var validationResult = this.submissionFileDownloadValidationService.GetValidationResult((submissionDetailsServiceModel!, currentUser));
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
        var problem = await this.submissionsData.GetProblemBySubmission<ProblemForSubmissionDetailsServiceModel>(submissionId);
        var user = this.userProviderService.GetCurrentUser();

        var participant = await this.submissionsData.GetParticipantBySubmission<ParticipantSubmissionResultsServiceModel>(submissionId);

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

        if (submissionType.ExecutionStrategyType != ExecutionStrategyType.NotFound &&
            submissionType.ExecutionStrategyType != ExecutionStrategyType.DoNothing)
        {
            await this.submissionsData.Add(newSubmission);
            await this.submissionsData.SaveChanges();

            newSubmission.Problem = problem;
            newSubmission.SubmissionType = submissionType;

            await this.submissionsDistributorCommunicationService.AddSubmissionForProcessing(newSubmission);
        }
        else
        {
            newSubmission.Processed = true;
            newSubmission.Points = 0;

            await this.submissionsData.Add(newSubmission);
            await this.submissionsData.SaveChanges();

            newSubmission.Problem = problem;

            await this.participantScoresBusinessService.SaveForSubmission(newSubmission);
        }
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

        var exception = submissionExecutionResult.Exception;
        var executionResult = submissionExecutionResult.ExecutionResult;

        submission.ProcessingComment = null;
        await this.testRunsDataService.DeleteBySubmission(submission.Id);

        if (exception != null)
        {
            submission.ProcessingComment = exception.Message;
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
        => this.submissionsData.GetTotalSubmissionsCount();

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