namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Authorization;
using OJS.Data.Models;
using static OJS.Common.GlobalConstants.Roles;

[Authorize(Roles = Administrator)]
public class LecturersInContestsController : BaseAutoCrudAdminController<LecturerInContest>
{
}