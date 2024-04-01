namespace OJS.Services.Administration.Business.Roles.Validators;

using FluentValidation;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Data;
using System.Threading.Tasks;

public class RoleDeleteValidator : BaseDeleteValidator<BaseDeleteValidationModel<string>, string>
{
    private readonly IDataService<Role> roleDataService;
    private readonly IDataService<UserInRole> userInRoleService;

    public RoleDeleteValidator(IDataService<Role> roleDataService, IDataService<UserInRole> userInRoleService)
    {
        this.roleDataService = roleDataService;
        this.userInRoleService = userInRoleService;

        this.ClassLevelCascadeMode = CascadeMode.Stop;

        this.RuleFor(x => x.Id)
            .NotEmpty()
            .MustAsync(async (model, _)
                => await this.NotHaveUsersToRole(model))
            .WithMessage("Cannot delete role which has users.");
    }

    private async Task<bool> NotHaveUsersToRole(string roleId)
        => !await this.userInRoleService.Exists(x => x.RoleId == roleId);
}