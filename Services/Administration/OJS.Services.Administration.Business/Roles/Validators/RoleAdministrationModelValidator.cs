namespace OJS.Services.Administration.Business.Roles.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;

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
            .MustAsync(async (model, _)
                => await this.NotHaveUsersToRole(model))
            .When(x => x.OperationType is CrudOperationType.Delete)
            .WithMessage("Cannot delete role which has users.");
    }

    private async Task<bool> NotHaveUsersToRole(string? roleId)
        => !await this.userInRoleService.Exists(x => x.RoleId == roleId);
}