namespace OJS.Services.Administration.Business.Roles.Validators;

using FluentValidation;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Common.Validation;

public class RoleAdministrationModelValidator : BaseValidator<RoleAdministrationModel>
{
    public RoleAdministrationModelValidator() =>
        this.RuleFor(model => model.Name)
            .NotEmpty();
}