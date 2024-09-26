namespace OJS.Web.Areas.Api.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using OJS.Services.Data.Contests;
    using OJS.Web.Infrastructure.Filters.Attributes;

    [ValidateRemoteDataApiKey]
    public class ContestsController : ApiController
    {
        private readonly IContestsDataService contestsData;

        public ContestsController(IContestsDataService contestsData)
        {
            this.contestsData = contestsData;
        }

        public ActionResult GetExistingIds(IEnumerable<int> ids)
        {
            var existingContestIds = this.contestsData
                .GetAll()
                .Where(c => ids.Contains(c.Id))
                .Select(c => c.Id)
                .ToList();

            return this.Content(JsonConvert.SerializeObject(existingContestIds));
        }
    }
}