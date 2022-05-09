namespace OJS.Servers.Ui.Controllers.Api
{
    using Microsoft.AspNetCore.Mvc;
    using OJS.Servers.Ui.Models.Contests;
    using OJS.Services.Ui.Business;
    using System.Threading.Tasks;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using System.Collections.Generic;

    public class ContestsController : Controller
    {
        private readonly IContestsBusinessService contestsBusinessService;

        public ContestsController(IContestsBusinessService contestsBusinessService)
            => this.contestsBusinessService = contestsBusinessService;

        [HttpGet]
        public async Task<ContestsForHomeIndexResponseModel> GetForHomeIndex()
            => await this.contestsBusinessService
                .GetAllForHomeIndex()
                .Map<ContestsForHomeIndexResponseModel>();

        public Task<IEnumerable<ContestForListingResponseModel>> GetAll(ContestFiltersRequestModel? model)
            => this.contestsBusinessService
                .GetContestByFilters(model?.Filters)
                .MapCollection<ContestForListingResponseModel>();
    }
}