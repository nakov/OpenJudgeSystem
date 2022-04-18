namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Extensions;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Extensions;
using System.Linq;
using System.Linq.Expressions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UsersInExamGroupsController : BaseAutoCrudAdminController<UserInExamGroup>
{
    public const string ExamGroupIdKey = nameof(UserInExamGroup.ExamGroupId);

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

    protected override Expression<Func<UserInExamGroup, bool>>? MasterGridFilter
        => this.TryGetEntityIdForNumberColumnFilter(ExamGroupIdKey, out var examGroupId)
            ? u => u.ExamGroupId == examGroupId
            : base.MasterGridFilter;

    protected override IEnumerable<AutoCrudAdminGridToolbarActionViewModel> CustomToolbarActions
        => this.TryGetEntityIdForNumberColumnFilter(ExamGroupIdKey, out var examGroupId)
            ? this.GetCustomToolbarActions(examGroupId)
            : base.CustomToolbarActions;

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, ValidatorResult>>
        EntityValidators
        => this.userInExamGroupValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.userInExamGroupValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        UserInExamGroup entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters).ToList();
        this.ModifyFormControls(formControls, entityDict);
        return formControls;
    }

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

    private void LockExamGroupId(IEnumerable<FormControlViewModel> formControls, int examGroupId)
    {
        var problemInput = formControls.First(fc => fc.Name == nameof(UserInExamGroup.ExamGroup));
        problemInput.Value = examGroupId;
        problemInput.IsReadOnly = true;
    }

    private void ModifyFormControls(
        IEnumerable<FormControlViewModel> formControls,
        IDictionary<string, string> entityDict)
    {
        var predefinedExamGroupId = entityDict.GetEntityIdOrDefault<ExamGroup>();

        if (predefinedExamGroupId.HasValue)
        {
            this.LockExamGroupId(formControls, predefinedExamGroupId.Value);
        }
    }

    private IEnumerable<AutoCrudAdminGridToolbarActionViewModel> GetCustomToolbarActions(int examGroupId)
    {
        var routeValues = new Dictionary<string, string>
        {
            { nameof(examGroupId), examGroupId.ToString() },
        };

        return new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new()
            {
                Name = "Add new",
                Action = nameof(this.Create),
                RouteValues = routeValues,
            },
        };
    }
}