namespace OJS.Web.Areas.Api.Controllers
{
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using OJS.Data;
    using OJS.Web.Infrastructure.Filters.Attributes;

    [ValidateRemoteDataApiKey]
    public class ContestsController : ApiController
    {
        private readonly IOjsDbContext dbContext;

        public ContestsController(IOjsDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public ActionResult Export(int id)
        {
            this.dbContext.DbContext.Configuration.LazyLoadingEnabled = false;
            this.dbContext.DbContext.Configuration.ProxyCreationEnabled = false;

            var contest = this.dbContext.Contests
                .Include(c => c.ProblemGroups)
                .Include(c => c.ProblemGroups.Select(pg => pg.Problems))
                .Include(c => c.ProblemGroups.Select(pg => pg.Problems.Select(p => p.Tests)))
                .Include(c => c.ProblemGroups.Select(pg => pg.Problems.Select(p => p.Checker)))
                .Include(c => c.ProblemGroups.Select(pg => pg.Problems.Select(p => p.SubmissionTypes)))
                .Include(c => c.ProblemGroups.Select(pg => pg.Problems.Select(p => p.ProblemSubmissionTypeExecutionDetails)))
                .Include(c => c.ProblemGroups.Select(pg => pg.Problems.Select(p => p.Resources)))
                .FirstOrDefault(c => c.Id == id);

            var jsonSettings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                NullValueHandling = NullValueHandling.Ignore,
            };

            return this.Content(JsonConvert.SerializeObject(contest, jsonSettings));
        }

        public ActionResult GetExistingIds(IEnumerable<int> ids)
        {
            var existingContestIds = this.dbContext.Contests
                .Where(c => !c.IsDeleted && ids.Contains(c.Id))
                .Select(c => c.Id)
                .ToList();

            return this.Content(JsonConvert.SerializeObject(existingContestIds));
        }
    }
}