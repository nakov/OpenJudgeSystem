namespace OJS.Web.Areas.Administration.ViewModels.Contest
{
    using System.Collections.Generic;
    using OJS.Services.Business.Contests.Models;

    public class ContestLoadCalculationViewModel : BaseContestBusinessModel
    {
        public string ContestName { get; set; }

        public int PreviousAverageProblemRunTimeInSeconds { get; set; }

        public ICollection<PreviousContestLoadData> ContestsDropdownData { get; set; } = new List<PreviousContestLoadData>();
    }
}