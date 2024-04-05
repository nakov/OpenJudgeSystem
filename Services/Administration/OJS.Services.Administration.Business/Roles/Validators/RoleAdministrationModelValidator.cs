namespace OJS.Services.Administration.Business.Roles.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;

public class RoleAdministrationModelValidator : BaseAdministrationModelValidator<RoleAdministrationModel, string, Role>
{
    private readonly IDataService<UserInRole> userInRoleService;

    public RoleAdministrationModelValidator(IDataService<Role> roleDataService, IDataService<UserInRole> userInRoleService)
        : base(roleDataService)
    {
        this.userInRoleService = userInRoleService;
        this.RuleFor(model => model.Name)
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.Id)
            .NotEmpty()
            .MustAsync(async (roleId, _) => !await this.userInRoleService.Exists(x => x.RoleId == roleId))
            .When(x => x.OperationType is CrudOperationType.Delete)
            .WithMessage("Cannot delete role which has users.");
    }
}