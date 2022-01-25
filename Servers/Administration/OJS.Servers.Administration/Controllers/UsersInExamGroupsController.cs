namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models;
using OJS.Services.Administration.Business.Validation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UsersInExamGroupsController : BaseAutoCrudAdminController<UserInExamGroup>
{
    private readonly IUsersInExamGroupsValidationService usersInExamGroupsValidation;

    public UsersInExamGroupsController(IUsersInExamGroupsValidationService usersInExamGroupsValidation)
        => this.usersInExamGroupsValidation = usersInExamGroupsValidation;

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, ValidatorResult>>
        EntityValidators
        => this.usersInExamGroupsValidation.GetValidators();

    protected override IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.usersInExamGroupsValidation.GetAsyncValidators();
}