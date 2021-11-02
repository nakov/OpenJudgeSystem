namespace OJS.Servers.Administration.Controllers
{
    using System.Diagnostics;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using OJS.Servers.Administration.Models;
    using OJS.Servers.Infrastructure.Controllers;

    public class HomeController : BaseViewController
    {
        private readonly ILogger<HomeController> logger;

        public HomeController(ILogger<HomeController> logger) => this.logger = logger;

        public IActionResult Index() => this.View();

        public IActionResult Privacy() => this.View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() =>
            this.View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}