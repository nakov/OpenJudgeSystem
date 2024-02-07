﻿namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Contests.Interfaces;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;

public class ContestsController : BaseAdminApiController<Contest, int, ContestInListModel, ContestAdministrationModel>
{
    private readonly IContestsDataService contestsData;

    public ContestsController(
        IContestsBusinessService contestsBusinessService,
        ContestAdministrationModelValidator validator,
        IGridDataService<Contest> contestGridDataService,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator,
        IContestPermissionsService contestPermissions,
        IContestsDataService contestsData)
    : base(
        contestGridDataService,
        contestsBusinessService,
        validator,
        deleteValidator,
        contestPermissions)
        => this.contestsData = contestsData;

    [HttpGet]
    public async Task<IActionResult> GetAllForProblem(string? searchString)
    {
        var contests =
            await this.contestsData
                .GetQueryForUser(
                    this.User.Map<UserInfoModel>(),
                    contest => contest.Name!.Contains(searchString ?? string.Empty))
                .MapCollection<ContestCopyProblemsValidationServiceModel>()
                .Take(20)
                .ToListAsync();
        return this.Ok(contests);
    }
}