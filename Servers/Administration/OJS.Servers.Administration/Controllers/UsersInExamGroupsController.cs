namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UsersInExamGroupsController : BaseAutoCrudAdminController<UserInExamGroup>
{
    private readonly IValidatorsFactory<UserInExamGroup> userInExamGroupValidatorsFactory;
    private readonly IValidationService<UserInExamGroupCreateDeleteValidationServiceModel> usersInExamGroupsCreateDeleteValidation;
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IExamGroupsDataService examGroupsData;

    public UsersInExamGroupsController(
        IValidatorsFactory<UserInExamGroup> userInExamGroupValidatorsFactory,
        IValidationService<UserInExamGroupCreateDeleteValidationServiceModel> usersInExamGroupsCreateDeleteValidation,
        IContestsValidationHelper contestsValidationHelper,
        IExamGroupsDataService examGroupsData)
    {
        this.userInExamGroupValidatorsFactory = userInExamGroupValidatorsFactory;
        this.usersInExamGroupsCreateDeleteValidation = usersInExamGroupsCreateDeleteValidation;
        this.contestsValidationHelper = contestsValidationHelper;
        this.examGroupsData = examGroupsData;
    }

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, ValidatorResult>>
        EntityValidators
        => this.userInExamGroupValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.userInExamGroupValidatorsFactory.GetAsyncValidators();

    protected override async Task BeforeEntitySaveAsync(UserInExamGroup entity, AdminActionContext actionContext)
    {
        var contestId = await this.examGroupsData.GetContestIdById(entity.ExamGroupId);

        var validationModel = new UserInExamGroupCreateDeleteValidationServiceModel
        {
            ContestId = contestId,
            IsCreate = actionContext.Action == EntityAction.Create,
        };

        this.usersInExamGroupsCreateDeleteValidation
            .GetValidationResult(validationModel)
            .VerifyResult();

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(contestId)
            .VerifyResult();
    }
}