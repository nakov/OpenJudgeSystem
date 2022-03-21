using OJS.Servers.Ui.Models.Submissions.Details;
using OJS.Servers.Ui.Models.Submissions.Results;
using System.Collections;

namespace OJS.Servers.Ui.Controllers.Api
{
    using Microsoft.AspNetCore.Mvc;
    using OJS.Services.Ui.Business;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using OJS.Servers.Ui.Models.Submissions.Profile;


    [Authorize]
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
            [FromQuery]bool isOfficial)
            => await this.submissionsBusiness
                .GetSubmissionResultsByProblem(id, isOfficial)
                .MapCollection<SubmissionResultsResponseModel>();
    }
}