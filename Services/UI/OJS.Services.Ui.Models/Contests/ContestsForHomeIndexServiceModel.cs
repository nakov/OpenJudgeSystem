namespace OJS.Services.Ui.Models.Contests
{
    using System.Collections.Generic;
    using System.Linq;

    public class ContestsForHomeIndexServiceModel
    {
        public IEnumerable<ContestForHomeIndexServiceModel> ActiveContests { get; set; }
            = Enumerable.Empty<ContestForHomeIndexServiceModel>();

        public IEnumerable<ContestForHomeIndexServiceModel> PastContests { get; set; }
            = Enumerable.Empty<ContestForHomeIndexServiceModel>();
    }
}