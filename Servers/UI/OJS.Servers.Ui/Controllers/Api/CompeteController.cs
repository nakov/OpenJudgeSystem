using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Models.Problems;
using OJS.Servers.Ui.Models.Submissions.Compete;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Controllers.Api
{
    [Authorize]
    public class CompeteController : Controller
    {
        private IContestsBusinessService contestsBusiness;
        private ISubmissionsBusinessService submissionsBusinessService;
        private IParticipantScoresBusinessService participantScoresBusinessService;

        public CompeteController(
            IContestsBusinessService contestsBusiness,
            ISubmissionsBusinessService submissionsBusinessService,
            IParticipantScoresBusinessService participantScoresBusinessService)
        {
            this.contestsBusiness = contestsBusiness;
            this.submissionsBusinessService = submissionsBusinessService;
            this.participantScoresBusinessService = participantScoresBusinessService;
        }

        public async Task<ContestParticipationServiceModel> Index(int id, [FromQuery] bool official)
            => await this.contestsBusiness.StartContestParticipation(new StartContestParticipationServiceModel
            {
                ContestId = id,
                IsOfficial = official
            });

        [HttpPost]
        public async Task Submit([FromBody] SubmissionRequestModel model)
            => await this.submissionsBusinessService.Submit(model.Map<SubmitSubmissionServiceModel>());

        public async Task<IEnumerable<ProblemResultResponseModel>> GetResultsByProblem(int id)
            => await this.participantScoresBusinessService
                .GetParticipantScoresByProblemForUser(id, true)
                .MapCollection<ProblemResultResponseModel>();
    }
}