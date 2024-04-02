namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Data.Models.Contests;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.ExamGroups;
using OJS.Services.Administration.Business.ExamGroups.GridData;
using OJS.Services.Administration.Business.ExamGroups.Permissions;
using OJS.Services.Administration.Business.ExamGroups.Validators;
using OJS.Services.Administration.Models.ExamGroups;
using System.Threading.Tasks;

public class ExamGroupsController : BaseAdminApiController<ExamGroup, int, ExamGroupInListModel, ExamGroupAdministrationModel>
{
    private readonly IExamGroupsBusinessService operationService;
    private readonly UserToExamGroupValidator userToExamGroupValidator;
    private readonly MultipleUsersToExamGroupModelValidator multipleUsersToExamGroupModelValidator;

    public ExamGroupsController(
       IExamGroupsGridDataService gridDataService,
       IExamGroupsBusinessService operationService,
       ExamGroupAdministrationModelValidator validator,
       ExamGroupDeleteValidator deleteValidator,
       UserToExamGroupValidator userToExamGroupValidator,
       MultipleUsersToExamGroupModelValidator multipleUsersToExamGroupModelValidator)
        : base(gridDataService, operationService, validator, deleteValidator)
    {
        this.operationService = operationService;
        this.userToExamGroupValidator = userToExamGroupValidator;
        this.multipleUsersToExamGroupModelValidator = multipleUsersToExamGroupModelValidator;
    }

    [HttpPost]
    [ProtectedEntityAction("model", typeof(UserToExamGroupPermissionService))]
    public async Task<IActionResult> AddToExamGroup(UserToExamGroupModel model)
    {
        var validationResult = await this.userToExamGroupValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.AddUserToExamGroup(model);
        return this.Ok("User successfully added to exam group");
    }

    [HttpPost]
    [ProtectedEntityAction("model", typeof(MultipleUsersToExamGroupPermissionService))]
    public async Task<IActionResult> AddMultipleUsersToExamGroup(MultipleUsersToExamGroupModel model)
    {
        var validationResult = await this.multipleUsersToExamGroupModelValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.AddMultipleUsersToExamGroup(model);
        return this.Ok("Users successfully added to exam group");
    }

    [HttpPost]
    [ProtectedEntityAction("model", typeof(UserToExamGroupPermissionService))]
    public async Task<IActionResult> RemoveUserFromExamGroup(UserToExamGroupModel model)
    {
        var validationResult = await this.userToExamGroupValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.RemoveUserFromExamGroup(model);
        return this.Ok("User successfully removed from exam group");
    }
}