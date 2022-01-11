using OJS.Servers.Ui.Models.Submissions.Details;
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
                .GetById(id);


            return res.Map<SubmissionDetailsResponseModel>();
        }

        public Task<IEnumerable<SubmissionForProfileResponseModel>> GetForProfile()
            => this.submissionsBusiness
                .GetForProfileByUser(this.User.Identity?.Name)
                .MapCollection<SubmissionForProfileResponseModel>();
    }
}