namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.Data.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OJS.Servers.Administration.Extensions;
using OJS.Common;
using OJS.Services.Administration.Models;
using GlobalResource = OJS.Common.Resources.SubmissionsController;

public class SubmissionsController : BaseAutoCrudAdminController<Submission>
{
    public const string ContestIdKey = nameof(ProblemGroup.ContestId);
    public const string ProblemIdKey = nameof(Submission.ProblemId);
    public const string ParticipantIdKey = nameof(Submission.ParticipantId);
    public const string SubmissionIdKey = nameof(Submission.Id);

    private readonly IProblemsValidationHelper problemsValidationHelper;
    private readonly IParticipantScoresBusinessService participantScoresBusiness;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ISubmissionsBusinessService submissionsBusinessService;
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
            new ()
            {
                Name = "Contest",
                ValueFunc = s => s.Problem != null ? s.Problem.ProblemGroup.Contest.ToString() : string.Empty,
            },
            new ()
            {
                Name = "Contest Id",
                ValueFunc = s => s.Problem != null ? s.Problem!.ProblemGroup.ContestId.ToString() : string.Empty,
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

        var submission = await this.submissionsData.GetByIdQuery(submissionId).FirstOrDefaultAsync();

        if (submission is null || !submission.ParticipantId.HasValue)
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
        var submissionParticipantId = submission.ParticipantId!.Value;

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
                    submission.ParticipantId.Value,
                    submission.ProblemId);
            }
        });
    }

    private Expression<Func<Submission, bool>>? GetMasterGridFilter()
    {
        if (this.TryGetEntityIdForNumberColumnFilter(ContestIdKey, out var contestId))
        {
            return x => x.Problem != null && x.Problem.ProblemGroup.ContestId == contestId;
        }

        if (this.TryGetEntityIdForNumberColumnFilter(ProblemIdKey, out var problemId))
        {
            return x => x.ProblemId == problemId;
        }

        if (this.TryGetEntityIdForNumberColumnFilter(ParticipantIdKey, out var participantId))
        {
            return x => x.ParticipantId == participantId;
        }

        if (this.TryGetEntityIdForNumberColumnFilter(ParticipantIdKey, out var submissionId))
        {
            return x => x.Id == submissionId;
        }

        return base.MasterGridFilter;
    }

    private IActionResult RedirectToSubmissionById(int id)
        => this.RedirectToActionWithNumberFilter(
            nameof(SubmissionsController),
            SubmissionsController.SubmissionIdKey,
            id);
}