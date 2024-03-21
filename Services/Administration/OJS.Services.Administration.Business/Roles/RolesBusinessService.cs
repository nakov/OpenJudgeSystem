namespace OJS.Services.Administration.Business.Roles;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class RolesBusinessService : AdministrationOperationService<Role, string, RoleAdministrationModel>, IRolesBusinessService
{
    private readonly IRoleDataService roleDataService;
    private readonly UserManager<UserProfile> userManager;
    private readonly IUsersDataService usersDataService;

    public RolesBusinessService(
        IRoleDataService roleDataService,
        UserManager<UserProfile> userManager,
        IUsersDataService usersDataService)
    {
        this.roleDataService = roleDataService;
        this.userManager = userManager;
        this.usersDataService = usersDataService;
    }

    public override async Task<RoleAdministrationModel> Get(string id)
        => await this.roleDataService.GetByIdQuery(id).MapCollection<RoleAdministrationModel>().FirstAsync();

    public override async Task<RoleAdministrationModel> Create(RoleAdministrationModel model)
    {
        var role = model.Map<Role>();

        role.Id = Guid.NewGuid().ToString();
        await this.roleDataService.Add(role);
        await this.roleDataService.SaveChanges();

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

        this.roleDataService.Update(role);
        await this.roleDataService.SaveChanges();

        return model;
    }

    public override async Task Delete(string id)
    {
        await this.roleDataService.DeleteById(id);
        await this.roleDataService.SaveChanges();
    }

    public async Task ManageUserInRole(UserToRoleModel model)
    {
        var roleName = await this.roleDataService
            .GetByIdQuery(model.RoleId!)
            .AsNoTracking()
            .Select(x => x.Name)
            .FirstAsync();

        var user = await this.usersDataService
            .GetByIdQuery(model.UserId!)
            .AsNoTracking()
            .FirstAsync();

        if (model.OperationType == "Add")
        {
            await this.userManager.AddToRoleAsync(user, roleName);
        }
        else
        {
            await this.userManager.RemoveFromRoleAsync(user, roleName);
        }

        await this.roleDataService.SaveChanges();
    }
}