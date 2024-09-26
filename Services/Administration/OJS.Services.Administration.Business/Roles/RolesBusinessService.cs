namespace OJS.Services.Administration.Business.Roles;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Linq;
using System.Threading.Tasks;

public class RolesBusinessService : AdministrationOperationService<Role, string, RoleAdministrationModel>, IRolesBusinessService
{
    private readonly IDataService<Role> roleDataService;
    private readonly UserManager<UserProfile> userManager;
    private readonly IUsersDataService usersDataService;
    private readonly RoleManager<Role> roleManager;

    public RolesBusinessService(
        IDataService<Role> roleDataService,
        UserManager<UserProfile> userManager,
        IUsersDataService usersDataService,
        RoleManager<Role> roleManager)
    {
        this.roleDataService = roleDataService;
        this.userManager = userManager;
        this.usersDataService = usersDataService;
        this.roleManager = roleManager;
    }

    public override async Task<RoleAdministrationModel> Get(string id)
        => await this.roleDataService.GetByIdQuery(id).MapCollection<RoleAdministrationModel>().FirstAsync();

    public override async Task<RoleAdministrationModel> Create(RoleAdministrationModel model)
    {
        var role = model.Map<Role>();

        role.Id = Guid.NewGuid().ToString();
        await this.roleManager.CreateAsync(role);

        return model;
    }

    public override async Task<RoleAdministrationModel> Edit(RoleAdministrationModel model)
    {
        var role = await this.roleDataService.GetByIdQuery(model.Id!).FirstOrDefaultAsync();
        if (role == null)
        {
            throw new BusinessServiceException("Invalid role id");
        }

        role.MapFrom(model);

        await this.roleManager.UpdateAsync(role);

        return model;
    }

    public override async Task Delete(string id)
    {
        await this.roleDataService.DeleteById(id);
        await this.roleDataService.SaveChanges();
    }

    public async Task AddToRole(UserToRoleModel model)
    {
       var (roleName, user) = await this.GetUserAndRoleName(model);
       await this.userManager.AddToRoleAsync(user, roleName);
    }

    public async Task RemoveFromRole(UserToRoleModel model)
    {
        var (roleName, user) = await this.GetUserAndRoleName(model);
        await this.userManager.RemoveFromRoleAsync(user, roleName);
    }

    public async Task<string> GetIdByName(string roleName)
    {
        var role = await this.roleManager.FindByNameAsync(roleName);

        return role is null
            ? throw new BusinessServiceException($"A role with name \"{roleName}\" does not exist.")
            : role.Id;
    }

    private async Task<(string, UserProfile)> GetUserAndRoleName(UserToRoleModel model)
    {
         var roleName = await this.roleDataService!
            .GetByIdQuery(model.RoleId!)
            .Select(x => x.Name!)
            .FirstAsync();

         var user = await this.usersDataService
            .GetByIdQuery(model.UserId!)
            .FirstAsync();

         return (roleName, user);
    }
}