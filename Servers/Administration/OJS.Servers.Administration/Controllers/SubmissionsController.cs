namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
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
using OJS.Servers.Administration.Infrastructure.Extensions;
using GlobalResource = OJS.Common.Resources.SubmissionsController;


public class SubmissionsController : BaseAutoCrudAdminController<Submission>
{
    public const string ContestIdKey = nameof(ProblemGroup.ContestId);
    public const string ProblemIdKey = nameof(Submission.ProblemId);
    public const string ParticipantIdKey = nameof(Submission.ParticipantId);
    public const string SubmissionIdKey = nameof(Submission.Id);

    private readonly IProblemsValidationHelper problemsValidationHelper;
    private readonly IParticipantScoresDataService participantScoresData;
    private readonly IParticipantScoresBusinessService participantScoresBusiness;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ISubmissionsBusinessService submissionsBusinessService;
    private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;
    private readonly ITestRunsDataService testRunsData;
    private readonly ITransactionsProvider transactions;
    private readonly IValidatorsFactory<Submission> submissionValidatorsFactory;

    public SubmissionsController(
        IProblemsValidationHelper problemsValidationHelper,
        IParticipantScoresDataService participantScoresData,
        IParticipantScoresBusinessService participantScoresBusiness,
        ISubmissionsDataService submissionsData,
        ISubmissionsForProcessingDataService submissionsForProcessingData,
        ITestRunsDataService testRunsData,
        ITransactionsProvider transactions,
        IValidatorsFactory<Submission> submissionValidatorsFactory,
        ISubmissionsBusinessService submissionsBusinessService)
    {
        this.problemsValidationHelper = problemsValidationHelper;
        this.participantScoresData = participantScoresData;
        this.participantScoresBusiness = participantScoresBusiness;
        this.submissionsData = submissionsData;
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.testRunsData = testRunsData;
        this.transactions = transactions;
        this.submissionValidatorsFactory = submissionValidatorsFactory;
        this.submissionsBusinessService = submissionsBusinessService;
    }

    protected override Expression<Func<Submission, bool>>? MasterGridFilter
        => GetMasterGridFilter();

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
                Name = "Contest",
                ValueFunc = s => s.Problem != null ? s.Problem.ProblemGroup.Contest.ToString() : string.Empty,
            },
            new()
            {
                Name = "Contest Id",
                ValueFunc = s => s.Problem != null ? s.Problem!.ProblemGroup.ContestId.ToString() : string.Empty,
            },
        };

    protected override IEnumerable<GridAction> CustomActions
        => new []
        {
            new GridAction { Action = nameof(this.Retest) },
        };

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        Submission entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        complexOptionFilters.Add(
            new KeyValuePair<string, Expression<Func<object, bool>>>(
                nameof(entity.Participant),
                p => ((Participant)p).Id == entity.ParticipantId));

        return base.GenerateFormControls(entity, action, entityDict, complexOptionFilters);
    }

    protected override async Task BeforeEntitySaveAsync(Submission submission, AdminActionContext actionContext)
        => await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(submission.ProblemId ?? default)
            .VerifyResult();

    protected override async Task DeleteEntityAndSaveAsync(Submission submission, AdminActionContext actionContext)
    {
        var submissionProblemId = submission.ProblemId!.Value;
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
                    submission.ProblemId.Value);
            }
        });
    }

    public async Task<IActionResult> Retest([FromQuery] IDictionary<string, string> complexId)
    {
        var submissionId = this.GetEntityIdFromQuery<int>(complexId);

        var submission = await this.submissionsData.GetByIdQuery(submissionId).FirstOrDefaultAsync();

        if (submission is null || !submission.ProblemId.HasValue || !submission.ParticipantId.HasValue)
        {
            this.TempData.AddDangerMessage(GlobalResource.Submission_can_not_be_processed);

            return this.RedirectToAction(nameof(this.Index));
        }

        if (!string.IsNullOrEmpty(submission.TestRunsCache) &&
            !submission.Processed)
        {
            this.TempData.AddDangerMessage(GlobalResource.Submission_is_processing);

            return this.RedirectToSubmissionById(submissionId);
        }

        await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(submission.ProblemId ?? default)
            .VerifyResult();

        var retestResult = await this.submissionsBusinessService.Retest(submission);

        if (retestResult.IsError)
        {
            this.TempData.AddDangerMessage(retestResult.Error);

            return this.RedirectToSubmissionById(submissionId);
        }

        this.TempData.AddSuccessMessage(GlobalResource.Submission_is_added_in_queue_for_processing);

        return this.RedirectToSubmissionById(submissionId);
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