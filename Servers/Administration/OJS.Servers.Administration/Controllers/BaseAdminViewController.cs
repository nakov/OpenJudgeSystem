namespace OJS.Servers.Administration.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using OJS.Servers.Infrastructure.Controllers;
    using static OJS.Common.GlobalConstants.Roles;

    [Authorize(Roles = AdministratorOrLecturer)]
    public class BaseAdminViewController : BaseViewController
    {
    }
}