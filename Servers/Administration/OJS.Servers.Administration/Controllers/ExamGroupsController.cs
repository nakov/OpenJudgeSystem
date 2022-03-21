namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupsController : BaseAutoCrudAdminController<ExamGroup>
{
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IValidatorsFactory<ExamGroup> examGroupValidatorsFactory;

    public ExamGroupsController(
        IContestsValidationHelper contestsValidationHelper,
        IValidatorsFactory<ExamGroup> examGroupValidatorsFactory)
    {
        this.contestsValidationHelper = contestsValidationHelper;
        this.examGroupValidatorsFactory = examGroupValidatorsFactory;
    }

    public IActionResult Users([FromQuery] IDictionary<string, string> complexId)
    {
        var examGroupId = this.GetEntityIdFromQuery<int>(complexId);
        return this.RedirectToAction(
            "Index",
            "Users",
            new Dictionary<string, string>
            {
                { nameof(UserInExamGroup.ExamGroupId), examGroupId.ToString() },
            });
    }

    protected override IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>> EntityValidators
        => this.examGroupValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.examGroupValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<GridAction> CustomActions
        => new GridAction[]
        {
            new() { Action = nameof(this.Users) },
        };

    protected override Task BeforeGeneratingForm(
        ExamGroup entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
        => this.ValidateContestPermissions(entity);

    protected override Task BeforeEntitySaveAsync(ExamGroup entity, AdminActionContext actionContext)
        => this.ValidateContestPermissions(entity);

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