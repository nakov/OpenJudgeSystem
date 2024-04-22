namespace OJS.Servers.Administration.Controllers;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Infrastructure.Extensions;
using OJS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OJS.Servers.Administration.Extensions;
using OJS.Common;
using OJS.Services.Administration.Models;
using OJS.Common.Extensions;
using OJS.Services.Administration.Business.Submissions;
using GlobalResource = OJS.Common.Resources.SubmissionsController;

public class SubmissionsController : BaseAutoCrudAdminController<Submission>
{
    public const string ContestIdKey = nameof(ProblemGroup.ContestId);
    public const string ProblemIdKey = nameof(Submission.ProblemId);
    public const string ParticipantIdKey = nameof(Submission.ParticipantId);
    private const string Participant = nameof(Submission.Participant);
    private const string ProblemName = nameof(Submission.Problem);
    private const string SubmissionIdKey = nameof(Submission.Id);
    private const string ContestName = nameof(Contest);

    private readonly IProblemsValidationHelper problemsValidationHelper;
    private readonly IParticipantScoresBusinessService participantScoresBusiness;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ISubmissionsBusinessService submissionsBusinessService;
    private readonly ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService;
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;
    private readonly ITestRunsDataService testRunsData;
    private readonly ITransactionsProvider transactions;
    private readonly IValidatorsFactory<Submission> submissionValidatorsFactory;

    public SubmissionsController(
        IProblemsValidationHelper problemsValidationHelper,
        IParticipantScoresBusinessService participantScoresBusiness,
        ISubmissionsDataService submissionsData,
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData,
        ITestRunsDataService testRunsData,
        ITransactionsProvider transactions,
        IValidatorsFactory<Submission> submissionValidatorsFactory,
        ISubmissionsBusinessService submissionsBusinessService,
        ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService,
        IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
        this.problemsValidationHelper = problemsValidationHelper;
        this.participantScoresBusiness = participantScoresBusiness;
        this.submissionsData = submissionsData;
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.testRunsData = testRunsData;
        this.transactions = transactions;
        this.submissionValidatorsFactory = submissionValidatorsFactory;
        this.submissionsBusinessService = submissionsBusinessService;
        this.lecturerContestPrivilegesBusinessService = lecturerContestPrivilegesBusinessService;
    }

    protected override Expression<Func<Submission, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

    protected override IEnumerable<Func<Submission, Submission, AdminActionContext, ValidatorResult>> EntityValidators
        => this.submissionValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<Submission, Submission, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.submissionValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<CustomGridColumn<Submission>> CustomColumns
        => new CustomGridColumn<Submission>[]
        {
            new()
            {
                Name = nameof(Contest),
                ValueFunc = s => s.Problem!.ProblemGroup.Contest.Name ?? string.Empty,
            },
            new()
            {
                Name = "Contest Id",
                ValueFunc = s => s.Problem!.ProblemGroup.ContestId.ToString(),
            },
        };

    protected override IEnumerable<GridAction> CustomActions
        => new[]
        {
            new GridAction { Action = nameof(this.Retest) },
            new GridAction { Action = nameof(this.DownloadAttachment) },
        };

    public async Task<IActionResult> DownloadAttachment([FromQuery] IDictionary<string, string> complexId)
    {
        var submissionId = this.GetEntityIdFromQuery<int>(complexId);

        var submission = await this.submissionsData.GetByIdQuery(submissionId).FirstOrDefaultAsync();
        if (submission == null)
        {
            this.TempData.AddDangerMessage(GlobalResource.SubmissionNotFound);

            return this.RedirectToAction(nameof(this.Index));
        }

        if (!submission.IsBinaryFile)
        {
            this.TempData.AddDangerMessage(GlobalResource.SubmissionNotFileUpload);

            return this.Redirect(this.Request.Headers.Referer);
        }

        return this.File(
            submission.Content,
            GlobalConstants.MimeTypes.ApplicationOctetStream,
            string.Format(GlobalConstants.Submissions.SubmissionDownloadFileName, submissionId, submission.FileExtension));
    }

    public async Task<IActionResult> Retest([FromQuery] IDictionary<string, string> complexId)
    {
        var submissionId = this.GetEntityIdFromQuery<int>(complexId);

        var submission = await this.submissionsData.GetByIdQuery(submissionId)
            .Include(s => s.SubmissionType)
            .Include(x => x.Problem)
                .ThenInclude(x => x.Checker)
            .Include(x => x.Problem)
                .ThenInclude(x => x.Tests)
            .FirstOrDefaultAsync();

        if (submission is null)
        {
            this.TempData.AddDangerMessage(GlobalResource.SubmissionCanNotBeProcessed);

            return this.RedirectToAction(nameof(this.Index));
        }

        if (!string.IsNullOrEmpty(submission.TestRunsCache) &&
            !submission.Processed)
        {
            this.TempData.AddDangerMessage(GlobalResource.SubmissionIsProcessing);

            return this.RedirectToSubmissionById(submissionId);
        }

        await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(submission.ProblemId)
            .VerifyResult();

        var retestResult = await this.submissionsBusinessService.Retest(submission);

        if (retestResult.IsError)
        {
            this.TempData.AddDangerMessage(retestResult.Error);

            return this.RedirectToSubmissionById(submissionId);
        }

        this.TempData.AddSuccessMessage(GlobalResource.SubmissionIsAddedInQueueForProcessing);

        return this.RedirectToSubmissionById(submissionId);
    }

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        Submission entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType)
    {
        complexOptionFilters.Add(
            new KeyValuePair<string, Expression<Func<object, bool>>>(
                nameof(entity.Participant),
                p => ((Participant)p).Id == entity.ParticipantId));

        return base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, autocompleteType);
    }

    protected override async Task BeforeEntitySaveAsync(Submission entity, AdminActionContext actionContext)
    {
        await base.BeforeEntitySaveAsync(entity, actionContext);
        await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(entity.ProblemId)
            .VerifyResult();
    }

    protected override async Task DeleteEntityAndSaveAsync(Submission submission, AdminActionContext actionContext)
    {
        var submissionProblemId = submission.ProblemId;
        var submissionParticipantId = submission.ParticipantId;

        await this.transactions.ExecuteInTransaction(async () =>
        {
            await this.testRunsData.DeleteBySubmission(submission.Id);
            await this.submissionsData.DeleteById(submission.Id);
            await this.submissionsData.SaveChanges();
            await this.submissionsForProcessingData.RemoveBySubmission(submission.Id);

            var isBestSubmission = await this.submissionsBusinessService.IsBestSubmission(
                submissionProblemId,
                submissionParticipantId,
                submission.Id);

            if (isBestSubmission)
            {
                await this.participantScoresBusiness.RecalculateForParticipantByProblem(
                    submission.ParticipantId,
                    submission.ProblemId);
            }
        });
    }

    protected override Expression<Func<Submission, bool>> GetMasterGridFilter()
    {
        var filterExpressions = new List<Expression<Func<Submission, bool>>>();

        var filterByLecturerRightsExpression = this.lecturerContestPrivilegesBusinessService
            .GetSubmissionsUserPrivilegesExpression(
                this.User.GetId(),
                this.User.IsAdmin());

        filterExpressions.Add(filterByLecturerRightsExpression);

        if (this.TryGetEntityIdForNumberColumnFilter(ContestIdKey, out var contestId))
        {
            filterExpressions.Add(s => s.Problem.ProblemGroup.ContestId == contestId);
        }

        if (this.TryGetEntityIdForStringColumnFilter(ProblemName, out var problemName))
        {
            filterExpressions.Add(s => s.Problem.Name == problemName);
        }

        if (this.TryGetEntityIdForStringColumnFilter(ContestName, out var contestName))
        {
            return s => s.Problem.ProblemGroup.Contest.Name == contestName;
        }

        if (this.TryGetEntityIdForNumberColumnFilter(ProblemIdKey, out var problemId))
        {
            filterExpressions.Add(s => s.ProblemId == problemId);
        }

        if (this.TryGetEntityIdForNumberColumnFilter(ParticipantIdKey, out var participantId))
        {
            filterExpressions.Add(s => s.ParticipantId == participantId);
        }

        if (this.TryGetEntityIdForStringColumnFilter(Participant, out var participant))
        {
            filterExpressions.Add(s => s.Participant != null && s.Participant.UserId == participant);
        }

        return filterExpressions.CombineMultiple();
    }

    private IActionResult RedirectToSubmissionById(int id)
        => this.RedirectToActionWithNumberFilter(
            nameof(SubmissionsController),
            SubmissionsController.SubmissionIdKey,
            id);
}