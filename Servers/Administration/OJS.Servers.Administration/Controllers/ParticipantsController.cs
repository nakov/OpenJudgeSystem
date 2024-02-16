namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Participants;
using OJS.Servers.Administration.Extensions;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using Microsoft.Extensions.Options;
using OJS.Common;
using OJS.Common.Extensions;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using System.Linq.Expressions;

public class ParticipantsController : BaseAutoCrudAdminController<Participant>
{
    public const string ContestIdKey = nameof(Participant.ContestId);
    private const string ContestName = nameof(Participant.Contest);
    private const string ParticipantUser = nameof(Participant.User);

    private readonly IValidatorsFactory<Participant> participantValidatorsFactory;
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IUsersDataService usersDataService;

    public ParticipantsController(
        IValidatorsFactory<Participant> participantValidatorsFactory,
        IContestsValidationHelper contestsValidationHelper,
        IUsersDataService usersDataService,
        IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
        this.participantValidatorsFactory = participantValidatorsFactory;
        this.contestsValidationHelper = contestsValidationHelper;
        this.usersDataService = usersDataService;
    }

    protected override Expression<Func<Participant, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<GridAction> CustomActions
        => new[]
        {
            new GridAction { Action = nameof(this.Submissions) },
        };

    protected override IEnumerable<Func<Participant, Participant, AdminActionContext, ValidatorResult>> EntityValidators
        => this.participantValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.participantValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<string> ShownFormControlNamesOnCreate
        => base.ShownFormControlNamesOnCreate
            .Concat(new[] { nameof(Participant.Contest), nameof(UserProfile.UserName), nameof(Participant.IsOfficial) });

    public IActionResult Submissions([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(SubmissionsController),
            SubmissionsController.ParticipantIdKey,
            this.GetEntityIdFromQuery<int>(complexId));

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        Participant entity,
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
            DisplayName = nameof(Participant.User),
            FormControlAutocompleteController = nameof(UsersController).ToControllerBaseUri(),
            FormControlAutocompleteEntityId = nameof(Participant.UserId),
        });

        var formControlToRemove = formControls.First(x =>
            x.DisplayName == nameof(Participant.User) && x.FormControlType != FormControlType.Autocomplete);
        formControls.Remove(formControlToRemove);

        return formControls;
    }

    protected override Task BeforeGeneratingForm(
        Participant entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
        => this.ValidateContestPermissions(entity);

    protected override async Task BeforeEntitySaveAsync(Participant entity, AdminActionContext actionContext)
    {
        await base.BeforeEntitySaveAsync(entity, actionContext);
        await this.ValidateContestPermissions(entity);
    }

    protected override Expression<Func<Participant, bool>>? GetMasterGridFilter()
    {
        var filterExpressions = new List<Expression<Func<Participant, bool>>>();

        if (this.TryGetEntityIdForStringColumnFilter(ContestName, out var contestName))
        {
            filterExpressions.Add(cc => cc.Contest.Name == contestName);
        }

        if (this.TryGetEntityIdForStringColumnFilter(ParticipantUser, out var userName))
        {
            filterExpressions.Add(cc => cc.User.UserName == userName);
        }

        return filterExpressions.CombineMultiple();
    }

    private Task ValidateContestPermissions(Participant entity)
        => this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(entity.ContestId)
            .VerifyResult();
}