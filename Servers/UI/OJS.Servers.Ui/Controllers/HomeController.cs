namespace OJS.Servers.Ui.Controllers
{
    using System.Diagnostics;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using OJS.Servers.Ui.Models;
    using Microsoft.AspNetCore.Authorization;
    using OJS.Servers.Infrastructure.Controllers;
    using OJS.Services.Infrastructure.Mapping;
    using OJS.Services.Common.Models;
    using OJS.Services.Infrastructure.HttpClients;

    public class HomeController : BaseViewController
    {
        private readonly ILogger<HomeController> logger;
        private readonly IMapperService mapper;
        private readonly ISulsPlatformHttpClientService sulsPlatformHttpClient;

        public HomeController(ILogger<HomeController> logger, IMapperService mapper, ISulsPlatformHttpClientService sulsPlatformHttpClient)
        {
            this.logger = logger;
            this.mapper = mapper;
            this.sulsPlatformHttpClient = sulsPlatformHttpClient;
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