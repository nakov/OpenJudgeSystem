namespace OJS.Servers.Administration.Controllers;

using Microsoft.Extensions.Options;
using OJS.Data.Models.Checkers;
using OJS.Services.Administration.Models;

public class CheckersController : BaseAutoCrudAdminController<Checker>
{
    public CheckersController(IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
    }
}