namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

public class ProblemGroupsController : BaseAutoCrudAdminController<ProblemGroup>
{
    private const string ContestName = nameof(Contest);

    private readonly IValidatorsFactory<ProblemGroup> problemGroupValidatorsFactory;
    private readonly IValidationService<ProblemGroupDeleteValidationServiceModel> problemGroupsDeleteValidation;
    private readonly IValidationService<ProblemGroupEditValidationServiceModel> problemGroupsEditValidation;
    private readonly IValidationService<ProblemGroupCreateValidationServiceModel> problemGroupsCreateValidation;
    private readonly IContestsActivityService contestsActivity;
    private readonly ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService;
    private readonly IContestsDataService contestsData;
    private readonly IProblemGroupsBusinessService problemGroupsBusiness;
    private readonly IContestsValidationHelper contestsValidationHelper;

    public ProblemGroupsController(
        IValidatorsFactory<ProblemGroup> problemGroupValidatorsFactory,
        IValidationService<ProblemGroupDeleteValidationServiceModel> problemGroupsDeleteValidation,
        IValidationService<ProblemGroupEditValidationServiceModel> problemGroupsEditValidation,
        IValidationService<ProblemGroupCreateValidationServiceModel> problemGroupsCreateValidation,
        IContestsActivityService contestsActivity,
        IContestsDataService contestsData,
        IContestsValidationHelper contestsValidationHelper,
        IProblemGroupsBusinessService problemGroupsBusiness,
        ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService,
        IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
        this.problemGroupValidatorsFactory = problemGroupValidatorsFactory;
        this.problemGroupsDeleteValidation = problemGroupsDeleteValidation;
        this.problemGroupsEditValidation = problemGroupsEditValidation;
        this.problemGroupsCreateValidation = problemGroupsCreateValidation;
        this.contestsActivity = contestsActivity;
        this.contestsData = contestsData;
        this.contestsValidationHelper = contestsValidationHelper;
        this.problemGroupsBusiness = problemGroupsBusiness;
        this.lecturerContestPrivilegesBusinessService = lecturerContestPrivilegesBusinessService;
    }

    protected override Expression<Func<ProblemGroup, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

    protected override IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, ValidatorResult>>
        EntityValidators
        => this.problemGroupValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.problemGroupValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<GridAction> CustomActions
        => new GridAction[]
        {
            new() { Action = nameof(this.Problems) },
        };

    public IActionResult Problems([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(ProblemsController),
            nameof(OJS.Data.Models.Problems.Problem.ProblemGroupId),
            this.GetEntityIdFromQuery<int>(complexId));

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        ProblemGroup entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, autocompleteType).ToList();

        formControls.Add(new FormControlViewModel
        {
            Name = nameof(ProblemGroup.Type),
            Options = EnumUtils.GetValuesFrom<ProblemGroupType>().Cast<object>(),
            Type = typeof(ProblemGroupType),
            Value = entity?.Type ?? default(ProblemGroupType),
        });

        if (action == EntityAction.Edit)
        {
            formControls.First(fc => fc.Name == nameof(ProblemGroup.Contest)).IsReadOnly = true;
        }

        return formControls;
    }

    protected override async Task BeforeEntitySaveAsync(ProblemGroup entity, AdminActionContext actionContext)
    {
        await base.BeforeEntitySaveAsync(entity, actionContext);
        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(entity.ContestId)
            .VerifyResult();
    }

    protected override Task BeforeGeneratingForm(
        ProblemGroup entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
        => this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(entity.ContestId)
            .VerifyResult();

    protected override async Task BeforeEntitySaveOnCreateAsync(ProblemGroup entity, AdminActionContext actionContext)
    {
        var contest = await this.contestsData.OneByIdTo<ContestForActivityServiceModel>(entity.ContestId);

        var validationModel = new ProblemGroupCreateValidationServiceModel
        {
            ContestIsActive = await this.contestsActivity.IsContestActive(contest!),
            ContestIsOnline = contest!.Type == ContestType.OnlinePracticalExam,
        };

        this.problemGroupsCreateValidation
            .GetValidationResult(validationModel)
            .VerifyResult();
    }

    protected override async Task BeforeEntitySaveOnEditAsync(
        ProblemGroup existingEntity,
        ProblemGroup newEntity,
        AdminActionContext actionContext)
    {
        var validationModel = new ProblemGroupEditValidationServiceModel
        {
            ExistingOrderBy = existingEntity.OrderBy,
            NewOrderBy = newEntity.OrderBy,
            ContestIsOnline = await this.contestsData.IsOnlineById(newEntity.ContestId),
        };

        this.problemGroupsEditValidation
            .GetValidationResult(validationModel)
            .VerifyResult();
    }

    protected override async Task BeforeEntitySaveOnDeleteAsync(ProblemGroup entity, AdminActionContext actionContext)
    {
        var validationModel = new ProblemGroupDeleteValidationServiceModel
        {
            ContestIsActive = await this.contestsActivity.IsContestActive(entity.ContestId),
        };

        this.problemGroupsDeleteValidation
            .GetValidationResult(validationModel)
            .VerifyResult();
    }

    protected override async Task AfterEntitySaveAsync(ProblemGroup entity, AdminActionContext actionContext)
        => await this.problemGroupsBusiness.ReevaluateProblemsAndProblemGroupsOrder(entity.ContestId, entity);

    protected override Expression<Func<ProblemGroup, bool>> GetMasterGridFilter()
    {
        var filterExpressions = new List<Expression<Func<ProblemGroup, bool>>>();

        var filterByLecturerRightsExpression = this.lecturerContestPrivilegesBusinessService.GetProblemGroupsUserPrivilegesExpression(
            this.User.GetId(),
            this.User.IsAdmin());

        filterExpressions.Add(filterByLecturerRightsExpression);

        if (this.TryGetEntityIdForStringColumnFilter(ContestName, out var contestName))
        {
            filterExpressions.Add(pg => pg.Contest.Name == contestName);
        }

        return filterExpressions.CombineMultiple();
    }
}