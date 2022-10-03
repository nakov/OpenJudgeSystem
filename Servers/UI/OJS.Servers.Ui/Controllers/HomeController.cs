namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Servers.Ui.Models;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Ui.Business;

public class HomeController : BaseViewController
{
    private readonly IContestsBusinessService contestsBusiness;

    public HomeController(
        IContestsBusinessService contestsBusiness)
        => this.contestsBusiness = contestsBusiness;

    public IActionResult Index()
        => this.View(new HomeViewModel
        {
            IsAuthenticated = this.HttpContext.User.IsAuthenticated(),
        });
}