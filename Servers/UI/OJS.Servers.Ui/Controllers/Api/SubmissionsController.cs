using OJS.Servers.Ui.Models.Submissions.Details;
using OJS.Servers.Ui.Models.Submissions.Results;
using OJS.Services.Ui.Models.Submissions;
using OJS.Web.Models.Submissions;

namespace OJS.Servers.Ui.Controllers.Api
{
    using Microsoft.AspNetCore.Mvc;
    using OJS.Services.Ui.Business;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using OJS.Servers.Ui.Models.Submissions.Profile;

    public class SubmissionsController : Controller
    {
        private ISubmissionsBusinessService submissionsBusiness;

        public SubmissionsController(ISubmissionsBusinessService submissionsBusiness)
            => this.submissionsBusiness = submissionsBusiness;


        [HttpGet]
        public async Task<SubmissionDetailsResponseModel> Details(int id)
        {
            var res = await this.submissionsBusiness
                .GetDetailsById(id);

            return res.Map<SubmissionDetailsResponseModel>();
        }

        public Task<IEnumerable<SubmissionForProfileResponseModel>> GetForProfile()
            => this.submissionsBusiness
                .GetForProfileByUser(this.User.Identity?.Name)
                .MapCollection<SubmissionForProfileResponseModel>();

        public async Task<IEnumerable<SubmissionResultsResponseModel>> GetSubmissionResultsByProblem(
            int id,
            [FromQuery]bool isOfficial,
            [FromQuery]int take)
            => await this.submissionsBusiness
                .GetSubmissionResultsByProblem(id, isOfficial, take)
                .MapCollection<SubmissionResultsResponseModel>();

        [HttpPost]
        public async Task<SaveExecutionResultResponseModel> SaveExecutionResult([FromBody] SubmissionExecutionResult submissionExecutionResult)
        {
            await this.submissionsBusiness.ProcessExecutionResult(submissionExecutionResult);

            return new SaveExecutionResultResponseModel
            {
                SubmissionId = submissionExecutionResult.SubmissionId,
            };
        }
    }
}