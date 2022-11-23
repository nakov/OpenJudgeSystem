namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupsController : BaseAutoCrudAdminController<ExamGroup>
{
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IValidatorsFactory<ExamGroup> examGroupValidatorsFactory;
    private readonly IValidationService<ExamGroupDeleteValidationServiceModel> examGroupsDeleteValidation;
    private readonly IContestsActivityService contestsActivity;

    public ExamGroupsController(
        IContestsValidationHelper contestsValidationHelper,
        IValidatorsFactory<ExamGroup> examGroupValidatorsFactory,
        IValidationService<ExamGroupDeleteValidationServiceModel> examGroupsDeleteValidation,
        IContestsActivityService contestsActivity)
    {
        this.contestsValidationHelper = contestsValidationHelper;
        this.examGroupValidatorsFactory = examGroupValidatorsFactory;
        this.examGroupsDeleteValidation = examGroupsDeleteValidation;
        this.contestsActivity = contestsActivity;
    }

    protected override IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>> EntityValidators
        => this.examGroupValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.examGroupValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<GridAction> CustomActions
        => new GridAction[]
        {
            new () { Action = nameof(this.Users) },
        };

    public IActionResult Users([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(UsersInExamGroupsController),
            UsersInExamGroupsController.ExamGroupIdKey,
            this.GetEntityIdFromQuery<int>(complexId));

    protected override Task BeforeGeneratingForm(
        ExamGroup entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
        => this.ValidateContestPermissions(entity);

    protected override Task BeforeEntitySaveAsync(ExamGroup entity, AdminActionContext actionContext)
        => this.ValidateContestPermissions(entity);

    protected override async Task BeforeEntitySaveOnDeleteAsync(ExamGroup entity, AdminActionContext actionContext)
    {
        if (!entity.ContestId.HasValue)
        {
            return;
        }

        var validationModel = entity.Map<ExamGroupDeleteValidationServiceModel>();

        var contest = await this.contestsActivity.GetContestActivity(entity.ContestId.Value);

        validationModel.ContestIsActive = contest.IsActive;

        this.examGroupsDeleteValidation
            .GetValidationResult(validationModel)
            .VerifyResult();
    }

    private async Task ValidateContestPermissions(ExamGroup entity)
    {
        if (entity.ContestId.HasValue)
        {
            await this.contestsValidationHelper
                .ValidatePermissionsOfCurrentUser(entity.ContestId)
                .VerifyResult();
        }
    }
}