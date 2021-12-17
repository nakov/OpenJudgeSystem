namespace OJS.Servers.Ui.Controllers.Api
{
    using Microsoft.AspNetCore.Mvc;
    using OJS.Servers.Ui.Models.Submissions;
    using OJS.Services.Ui.Business;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

    [Authorize]
    public class SubmissionsController : Controller
    {
        private ISubmissionsBusinessService submissionsBusiness;

        public SubmissionsController(ISubmissionsBusinessService submissionsBusiness)
            => this.submissionsBusiness = submissionsBusiness;

        public Task<IEnumerable<SubmissionForProfileResponseModel>> GetForProfile()
            => this.submissionsBusiness
                .GetForProfileByUser(this.User.Identity.Name)
                .Map<IEnumerable<SubmissionForProfileResponseModel>>();
    }
}