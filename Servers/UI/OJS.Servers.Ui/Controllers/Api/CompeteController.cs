using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Infrastructure.Extensions;
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

        public async Task Index(int id, bool official)
            => await this.contestsBusiness.StartContestParticipation(new StartContestParticipationServiceModel
            {
                ContestId = id,
                IsOfficial = official,
                UserId = await this.HttpContext.GetUserId(),
                UserPrincipal = this.HttpContext.User,
            });
    }
}