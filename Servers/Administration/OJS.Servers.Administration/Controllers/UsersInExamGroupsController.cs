namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Common;
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
using OJS.Data.Models.Users;

public class UsersInExamGroupsController : BaseAutoCrudAdminController<UserInExamGroup>
{
    public const string ExamGroupIdKey = nameof(UserInExamGroup.ExamGroupId);
    private const string UserId = nameof(UserInExamGroup.UserId);
    private const string ExamGroupName = nameof(UserInExamGroup.ExamGroup);
    private const string ExamGroupUsername = nameof(UserInExamGroup.User);

    private readonly IValidatorsFactory<UserInExamGroup> userInExamGroupValidatorsFactory;
    private readonly IValidationService<UserInExamGroupCreateDeleteValidationServiceModel> usersInExamGroupsCreateDeleteValidation;
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IExamGroupsDataService examGroupsData;
    private readonly IUsersDataService usersDataService;

    public UsersInExamGroupsController(
        IValidatorsFactory<UserInExamGroup> userInExamGroupValidatorsFactory,
        IValidationService<UserInExamGroupCreateDeleteValidationServiceModel> usersInExamGroupsCreateDeleteValidation,
        IContestsValidationHelper contestsValidationHelper,
        IExamGroupsDataService examGroupsData,
        IUsersDataService usersDataService)
    {
        this.userInExamGroupValidatorsFactory = userInExamGroupValidatorsFactory;
        this.usersInExamGroupsCreateDeleteValidation = usersInExamGroupsCreateDeleteValidation;
        this.contestsValidationHelper = contestsValidationHelper;
        this.examGroupsData = examGroupsData;
        this.usersDataService = usersDataService;
    }

    protected override Expression<Func<UserInExamGroup, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

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
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, typeof(UserProfile)).ToList();
        formControls.Add(new FormControlViewModel()
        {
            Name = nameof(UserProfile.UserName),
            Options = this.usersDataService.GetQuery(take: GlobalConstants.NumberOfAutocompleteItemsShown).ToList(),
            FormControlType = FormControlType.Autocomplete,
            DisplayName = nameof(UserInExamGroup.User),
            FormControlAutocompleteController = nameof(UsersController).ToControllerBaseUri(),
            FormControlAutocompleteEntityId = nameof(UserInExamGroup.UserId),
        });

        var formControlToRemove = formControls.First(x =>
            x.DisplayName == nameof(UserInExamGroup.User) && x.FormControlType != FormControlType.Autocomplete);
        formControls.Remove(formControlToRemove);

        ModifyFormControls(formControls, entityDict);

        return formControls;
    }

    protected override async Task BeforeEntitySaveAsync(UserInExamGroup entity, AdminActionContext actionContext)
    {
        await base.BeforeEntitySaveAsync(entity, actionContext);

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

    protected override Expression<Func<UserInExamGroup, bool>>? GetMasterGridFilter()
    {
        var filterExpressions = new List<Expression<Func<UserInExamGroup, bool>>>();

        if (this.TryGetEntityIdForNumberColumnFilter(ExamGroupIdKey, out var examGroupId))
        {
            filterExpressions.Add(ueg => ueg.ExamGroupId == examGroupId);
        }

        if (this.TryGetEntityIdForStringColumnFilter(UserId, out var userId))
        {
            filterExpressions.Add(ueg => ueg.UserId == userId);
        }

        if (this.TryGetEntityIdForStringColumnFilter(ExamGroupName, out var examGroupName))
        {
            filterExpressions.Add(ueg => ueg.ExamGroup.Name == examGroupName);
        }

        if (this.TryGetEntityIdForStringColumnFilter(ExamGroupUsername, out var examGroupUsername))
        {
            filterExpressions.Add(ueg => ueg.User.UserName == examGroupUsername);
        }

        if (filterExpressions.Count > 0)
        {
            Expression<Func<UserInExamGroup, bool>> combinedFilterExpression = filterExpressions
                .Aggregate((current, next) =>
                    Expression.Lambda<Func<UserInExamGroup, bool>>(
                        Expression.AndAlso(
                            current.Body,
                            Expression.Invoke(next, current.Parameters)),
                        current.Parameters));

            return combinedFilterExpression;
        }

        return base.MasterGridFilter;
    }

    private static void LockExamGroupId(IEnumerable<FormControlViewModel> formControls, int examGroupId)
    {
        var problemInput = formControls.First(fc => fc.Name == nameof(UserInExamGroup.ExamGroup));
        problemInput.Value = examGroupId;
        problemInput.IsReadOnly = true;
    }

    private static void ModifyFormControls(
        IEnumerable<FormControlViewModel> formControls,
        IDictionary<string, string> entityDict)
    {
        var predefinedExamGroupId = entityDict.GetEntityIdOrDefault<ExamGroup>();

        if (predefinedExamGroupId.HasValue)
        {
            LockExamGroupId(formControls, predefinedExamGroupId.Value);
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
            new ()
            {
                Name = "Add new",
                Action = nameof(this.Create),
                RouteValues = routeValues,
            },
        };
    }
}