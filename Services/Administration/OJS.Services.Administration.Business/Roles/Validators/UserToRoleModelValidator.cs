﻿namespace OJS.Services.Administration.Business.Roles.Validators;

using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Common.Validation;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class UserToRoleModelValidator : BaseValidator<UserToRoleModel>
{
    private readonly IUsersDataService usersDataService;
    private readonly IRoleDataService roleDataService;
    private readonly UserManager<UserProfile> userManager;

    public UserToRoleModelValidator(
        IUsersDataService usersDataService,
        IRoleDataService roleDataService,
        UserManager<UserProfile> userManager)
    {
        this.usersDataService = usersDataService;
        this.roleDataService = roleDataService;
        this.userManager = userManager;

        this.RuleLevelCascadeMode = CascadeMode.Stop;

        this.RuleFor(x => x.RoleId)
            .NotEmpty()
            .MustAsync(async (model, _) => await this.HaveRoleWithId(model!))
            .WithMessage("Role not found.");

        this.RuleFor(x => x.UserId)
            .NotEmpty()
            .MustAsync(async (model, _) => await this.HaveUserWithId(model!))
            .WithMessage("User not found.");

        this.RuleFor(model => model)
            .MustAsync(async (model, _) => await this.NotBeInRole(model.UserId!, model.RoleId!))
            .WithMessage("User is already in the role.");
    }

    private async Task<bool> HaveUserWithId(string userId)
        => await this.usersDataService.ExistsById(userId);

    private async Task<bool> HaveRoleWithId(string roleId)
        => await this.roleDataService.ExistsById(roleId);

    private async Task<bool> NotBeInRole(string userId, string roleId)
    {
        var user = await this.usersDataService
            .GetByIdQuery(userId)
            .AsNoTracking()
            .FirstAsync();

        var role = await this.roleDataService
            .GetByIdQuery(roleId)
            .Select(x => x.Id)
            .AsNoTracking()
            .FirstAsync();

        return !await this.userManager.IsInRoleAsync(user, role!);
    }
}