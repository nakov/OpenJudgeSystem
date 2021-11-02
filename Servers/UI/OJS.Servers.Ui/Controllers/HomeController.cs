namespace OJS.Servers.Ui.Controllers
{
    using System.Diagnostics;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using OJS.Servers.Ui.Models;
    using Microsoft.AspNetCore.Authorization;
    using OJS.Services.Infrastructure.Mapping;
    using OJS.Services.Models;

    public class HomeController : BaseViewController
    {
        private readonly ILogger<HomeController> logger;
        private readonly IMapperService mapper;

        public HomeController(ILogger<HomeController> logger, IMapperService mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public IActionResult Index()
        {
            var serviceModel = new TestServiceModel();

            var mappedModel = this.mapper.Map<TestModel>(serviceModel);

            return this.View();
        }

        [Authorize]
        public IActionResult Privacy() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}