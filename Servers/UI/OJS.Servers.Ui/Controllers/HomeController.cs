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

        // public async Task<IActionResult> Index()
        // {
        //     var activeContests = await this.contestsBusiness
        //         .GetAllCompetable()
        //         .MapCollection<HomeContestViewModel>();
        //
        //     var pastContests = await this.contestsBusiness
        //         .GetAllPast()
        //         .MapCollection<HomeContestViewModel>();
        //
        //     var indexViewModel = new IndexViewModel
        //     {
        //         ActiveContests = activeContests,
        //         PastContests = pastContests,
        //     };
        //
        //     return this.View();
        // }
    }
}