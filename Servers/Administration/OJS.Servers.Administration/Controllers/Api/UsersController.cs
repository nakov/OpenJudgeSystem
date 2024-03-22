namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Data.Models.Users;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.LecturersInContests;
using OJS.Services.Administration.Business.LecturersInContests.GridData;
using OJS.Services.Administration.Business.LecturersInContests.Permissions;
using OJS.Services.Administration.Business.Roles.Permissions;
using OJS.Services.Administration.Business.Users;
using OJS.Services.Administration.Business.Users.GridData;
using OJS.Services.Administration.Business.Users.Permissions;
using OJS.Services.Administration.Business.Users.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.LecturerInContests;
using OJS.Services.Administration.Models.Users;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;

public class UsersController : BaseAdminApiController<UserProfile, string, UserInListModel, UserAdministrationModel>
{
    private readonly IUsersGridDataService usersGridData;
    private readonly IUsersDataService usersDataService;
    private readonly ILecturersInContestsGridDataService lecturersInContestsGridDataService;
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusinessService;

    public UsersController(
       IUsersGridDataService usersGridData,
       IUsersBusinessService usersBusinessService,
       UserAdministrationModelValidator validator,
       UserDeleteValidator deleteValidator,
       IUsersDataService usersDataService,
       ILecturersInContestsGridDataService lecturersInContestsGridDataService,
       ILecturersInContestsBusinessService lecturersInContestsBusinessService)
        : base(
            usersGridData,
            usersBusinessService,
            validator,
            deleteValidator)
    {
        this.usersGridData = usersGridData;
        this.usersDataService = usersDataService;
        this.lecturersInContestsGridDataService = lecturersInContestsGridDataService;
        this.lecturersInContestsBusinessService = lecturersInContestsBusinessService;
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> GetNameAndId(string? searchString)
    {
        var users =
            await this.usersDataService
                .GetQueryForUser(
                    this.User.Map<UserInfoModel>(),
                    user => user.UserName!.Contains(searchString ?? string.Empty))
                .AsNoTracking()
                .MapCollection<UserDropdownModel>()
                .Take(20)
                .ToListAsync();
        return this.Ok(users);
    }

    [HttpGet("{roleId}")]
    [ProtectedEntityAction("roleId", typeof(RoleIdPermissionService))]
    public async Task<IActionResult> GetByRoleId([FromQuery] PaginationRequestModel model, [FromRoute] string roleId)
        => this.Ok(
            await this.usersGridData.GetAll<UserInListModel>(
                model,
                user => user.UsersInRoles!.Any(ur => ur.RoleId == roleId)));

    [HttpGet("{userId}")]
    [ProtectedEntityAction("userId", typeof(UserIdPermissionService))]
    public async Task<IActionResult> GetLecturerContests([FromQuery] PaginationRequestModel model, [FromRoute] string userId)
        => this.Ok(
            await this.lecturersInContestsGridDataService.GetAll<LecturerInContestInListModel>(
                model,
                linc => linc.LecturerId == userId));

    [HttpPost]
    [ProtectedEntityAction("model", typeof(LecturerToContestPermissionService))]
    public async Task<IActionResult> AddLecturerToContest(LecturerToContestModel model)
    {
        await this.lecturersInContestsBusinessService.AddLecturerToContest(model);
        return this.Ok("Lecturer successfully added to contest");
    }

    [HttpDelete]
    [ProtectedEntityAction("lecturerId", typeof(UserIdPermissionService))]
    public async Task<IActionResult> RemoveLecturerFromContest([FromQuery] string lecturerId, [FromQuery] int contestId)
    {
        await this.lecturersInContestsBusinessService.RemoveLecturerFromContest(
            new LecturerToContestModel
            {
                LecturerId = lecturerId,
                ContestId = contestId,
                OperationType = CrudOperationTypes.Delete,
            });
        return this.Ok("Lecturer successfully removed from contest");
    }
}