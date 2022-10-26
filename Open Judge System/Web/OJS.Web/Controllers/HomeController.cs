namespace OJS.Web.Controllers
{
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using OJS.Data;
    using OJS.Services.Cache;
    using OJS.Services.Data.Contests;
    using OJS.Web.ViewModels.Home.Index;

    public class HomeController : BaseController
    {
        private readonly ICacheItemsProviderService cache;

        public HomeController(IOjsData data, ICacheItemsProviderService cache)
            : base(data) =>
                this.cache = cache;

        public ActionResult Index()
        {
            var indexViewModel = new IndexViewModel
            {
                ActiveContests = this.cache.GetActiveContests(),
                PastContests = this.cache.GetPastContests()
            };

            return this.View(indexViewModel);
        }

        /// <summary>
        /// Gets the robots.txt file.
        /// </summary>
        /// <returns>Returns a robots.txt file.</returns>
        [HttpGet]
        [OutputCache(Duration = 3600)]
        public FileResult RobotsTxt()
        {
            var robotsTxtContent = new StringBuilder();
            robotsTxtContent.AppendLine("User-Agent: *");
            robotsTxtContent.AppendLine("Allow: /");

            return this.File(Encoding.ASCII.GetBytes(robotsTxtContent.ToString()), "text/plain");
        }
    }
}