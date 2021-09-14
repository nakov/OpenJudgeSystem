namespace OJS.Web.Controllers
{
    using System.Web.Mvc;

    using OJS.Data;

    public class StatisticsController : BaseController
    {
        public StatisticsController(IOjsData data)
            : base(data)
        {
        }

        public ActionResult Index()
        {
            return this.View();
        }
    }
}