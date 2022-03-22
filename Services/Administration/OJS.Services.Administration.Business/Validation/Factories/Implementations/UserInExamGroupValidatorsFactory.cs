namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class UserInExamGroupValidatorsFactory : IValidatorsFactory<UserInExamGroup>
{
    public IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<UserInExamGroup, UserInExamGroup, AdminActionContext, ValidatorResult>[]
        {
            ValidateEditIsNotPermitted,
        };

    public IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, Task<ValidatorResult>>>();

    private static ValidatorResult ValidateEditIsNotPermitted(
        UserInExamGroup existingEntity,
        UserInExamGroup newEntity,
        AdminActionContext actionContext)
        => actionContext.Action == EntityAction.Edit
            ? ValidatorResult.Error("Action not permitted")
            : ValidatorResult.Success();
}