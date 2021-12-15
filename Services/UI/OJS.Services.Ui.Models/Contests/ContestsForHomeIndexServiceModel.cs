namespace OJS.Services.Ui.Models.Contests
{
    using System.Collections.Generic;

    public class ContestsForHomeIndexServiceModel
    {
        public IEnumerable<ContestForHomeIndexServiceModel> ActiveContests { get; set; }

        public IEnumerable<ContestForHomeIndexServiceModel> PastContests { get; set; }
    }
}