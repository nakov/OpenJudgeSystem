namespace OJS.Servers.Ui.Controllers
{
    using Microsoft.AspNetCore.Mvc;
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
        {
            var vm = new CreateReactAppViewModel(HttpContext);
            return this.View(vm);
        }
    }
}