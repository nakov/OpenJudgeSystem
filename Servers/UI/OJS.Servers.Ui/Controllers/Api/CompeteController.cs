using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Models.Submissions.Compete;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Controllers.Api
{
    [Authorize]
    public class CompeteController : Controller
    {
        private IContestsBusinessService contestsBusiness;
        private ISubmissionsBusinessService submissionsBusinessService;

        public CompeteController(
            IContestsBusinessService contestsBusiness,
            ISubmissionsBusinessService submissionsBusinessService)
        {
            this.contestsBusiness = contestsBusiness;
            this.submissionsBusinessService = submissionsBusinessService;
        }

        public async Task<ContestParticipationServiceModel> Index(int id, [FromQuery] bool official)
            => await this.contestsBusiness.StartContestParticipation(new StartContestParticipationServiceModel
            {
                ContestId = id,
                IsOfficial = official
            });

        public async Task Submit(SubmissionRequestModel model, bool isOfficial)
            => await this.submissionsBusinessService.Submit(model.Map<SubmitSubmissionServiceModel>(), isOfficial);
    }
}