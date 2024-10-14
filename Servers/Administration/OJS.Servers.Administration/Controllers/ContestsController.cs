﻿namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models.Contests;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.Contests.GridData;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Administration.Business.Similarity;
using OJS.Services.Administration.Business.Users.Permissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

public class ContestsController : BaseAdminApiController<Contest, int, ContestInListModel, ContestAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly ContestAdministrationModelValidator validator;
    private readonly ContestSimilarityModelValidator similarityModelValidator;
    private readonly ContestTransferParticipantsModelValidator contestTransferParticipantsModelValidator;
    private readonly IContestsDataService contestsData;
    private readonly ISimilarityService similarityService;
    private readonly IExcelService excelService;

    public ContestsController(
        IContestsBusinessService contestsBusinessService,
        ContestAdministrationModelValidator validator,
        ContestSimilarityModelValidator similarityModelValidator,
        ContestTransferParticipantsModelValidator contestTransferParticipantsModelValidator,
        IContestsGridDataService contestGridDataService,
        IContestsDataService contestsData,
        ISimilarityService similarityService,
        IExcelService excelService)
    : base(
        contestGridDataService,
        contestsBusinessService,
        validator)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.validator = validator;
        this.similarityModelValidator = similarityModelValidator;
        this.contestTransferParticipantsModelValidator = contestTransferParticipantsModelValidator;
        this.contestsData = contestsData;
        this.similarityService = similarityService;
        this.excelService = excelService;
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> GetAllForProblem(string? searchString)
    {
        var contestsById = new List<ContestCopyProblemsValidationServiceModel>();
        if (int.TryParse(searchString, out var contestId))
        {
            // If searchString is number, try to find contest by id and append it first in the result list
            contestsById = await this.contestsData
                .GetQueryForUser(
                    this.User.Map<UserInfoModel>(),
                    contest => contest.Id == contestId)
                .MapCollection<ContestCopyProblemsValidationServiceModel>()
                .ToListAsync();
        }

        var contestsByName =
            await this.contestsData
                .GetQueryForUser(
                    this.User.Map<UserInfoModel>(),
                    contest => contest.Name!.Contains(searchString ?? string.Empty))
                .MapCollection<ContestCopyProblemsValidationServiceModel>()
                .Take(20)
                .ToListAsync();

        return this.Ok(contestsById.Concat(contestsByName));
    }

    [HttpGet]
    [ProtectedEntityAction(nameof(userId), typeof(UserIdPermissionService))]
    public async Task<IActionResult> GetForLecturerInContest(string userId)
        => await this.contestsBusinessService
            .GetForLecturerInContest(userId)
            .ToOkResult();

    [HttpPost]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> DownloadSubmissions(DownloadSubmissionsModel model)
    {
        var file = await this.contestsBusinessService.DownloadSubmissions(model);

        return this.File(file.Content!, file.MimeType!, file.FileName);
    }

    [HttpGet]
    [ProtectedEntityAction("contestId", typeof(ContestIdPermissionsService))]
    public async Task<IActionResult> Activity(int contestId)
    {
        var validationResult = await this.validator
            .ValidateAsync(new ContestAdministrationModel { Id = contestId, OperationType = CrudOperationType.Read })
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        var result = await this.contestsBusinessService.GetContestActivity(contestId);
        return this.Ok(result);
    }

    [HttpPost]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> Export(ContestResultsExportRequestModel model)
    {
        var file = await this.contestsBusinessService.ExportResults(model);
        return this.File(file.Content!, file.MimeType!, file.FileName);
    }

    [HttpPost]
    [ProtectedEntityAction("model", typeof(ContestSimilarityPermissionService))]
    public async Task<ActionResult> CheckSimilarity(SimillarityCheckModel model)
    {
        var validationResult = await this.similarityModelValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        var result = await this.similarityService.GetSubmissionSimilarities(model);

        var file = this.excelService.ExportResults(result);
        return this.File(file.Content!, file.MimeType!, $"{nameof(this.CheckSimilarity)}.xls");
    }

    [HttpPatch]
    [ProtectedEntityAction("contestId", typeof(ContestIdPermissionsService))]
    public async Task<IActionResult> TransferParticipants(int contestId)
    {
        var model = new ContestTransferParticipantsModel { ContestId = contestId };

        var validationResult = await this.contestTransferParticipantsModelValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.contestsBusinessService.TransferParticipantsToPracticeById(model.ContestId);
        return this.Ok("The participants were transferred successfully.");
    }
}