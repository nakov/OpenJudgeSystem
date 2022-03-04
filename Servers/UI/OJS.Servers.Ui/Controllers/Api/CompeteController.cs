using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Contests;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Controllers.Api
{
    [Authorize]
    public class CompeteController : Controller
    {
        private IContestsBusinessService contestsBusiness;

        public CompeteController(IContestsBusinessService contestsBusiness)
            => this.contestsBusiness = contestsBusiness;

        public async Task<ContestParticipationServiceModel> Index(int id, [FromQuery] bool official)
            => await this.contestsBusiness.StartContestParticipation(new StartContestParticipationServiceModel
            {
                ContestId = id,
                IsOfficial = official
            });
    }
}