namespace OJS.Servers.Ui.Controllers.Api
{
    using Microsoft.AspNetCore.Mvc;
    using OJS.Servers.Ui.Models.Contests;
    using OJS.Services.Ui.Business;
    using System.Threading.Tasks;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

    public class ContestsController : Controller
    {
        private IContestsBusinessService contestsBusinessService;

        public ContestsController(IContestsBusinessService contestsBusinessService)
            => this.contestsBusinessService = contestsBusinessService;

        [HttpGet]
        public async Task<ContestsForHomeIndexResponseModel> GetForHomeIndex()
            => await this.contestsBusinessService
                .GetAllForHomeIndex()
                .Map<ContestsForHomeIndexResponseModel>();
    }
}