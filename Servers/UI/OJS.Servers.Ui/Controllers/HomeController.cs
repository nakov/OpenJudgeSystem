namespace OJS.Servers.Ui.Controllers
{
    using System.Diagnostics;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Servers.Ui.Models;
    using Microsoft.AspNetCore.Authorization;
    using OJS.Servers.Infrastructure.Controllers;
    using OJS.Servers.Ui.Models.Home;
    using OJS.Servers.Ui.Models.Home.Index;
    using OJS.Services.Infrastructure.Mapping;
    using OJS.Services.Ui.Business;
    using System.Threading.Tasks;

    public class HomeController : BaseViewController
    {
        private readonly IContestsBusinessService contestsBusiness;

        public HomeController(
            IContestsBusinessService contestsBusiness)
            => this.contestsBusiness = contestsBusiness;

        public async Task<IActionResult> Index()
        {
            var activeContests = await this.contestsBusiness
                .GetAllCompetable()
                .MapCollection<HomeContestViewModel>();

            var pastContests = await this.contestsBusiness
                .GetAllPast()
                .MapCollection<HomeContestViewModel>();

            var indexViewModel = new IndexViewModel
            {
                ActiveContests = activeContests,
                PastContests = pastContests,
            };

            return this.View();
        }

        [Authorize]
        public IActionResult Privacy() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}