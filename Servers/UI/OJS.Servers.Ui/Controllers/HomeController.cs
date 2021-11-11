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
        private readonly IMapperService mapper;

        public HomeController(
            IContestsBusinessService contestsBusiness,
            IMapperService mapper)
        {
            this.contestsBusiness = contestsBusiness;
            this.mapper = mapper;
        }

        public async Task<IActionResult> Index()
        {
            var activeContests = this.mapper.MapCollection<HomeContestViewModel>(
                await this.contestsBusiness.GetAllCompetable());

            var pastContests = this.mapper.MapCollection<HomeContestViewModel>(
                await this.contestsBusiness.GetAllPast());

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