namespace OJS.Web.ViewModels.Home.Index
{
    using System.Collections.Generic;
    using OJS.Services.Cache.Models;

    public class IndexViewModel
    {
        public IEnumerable<HomeContestViewModel> ActiveContests { get; set; }

        public IEnumerable<HomeContestViewModel> PastContests { get; set; }
    }
}