namespace OJS.Web.ViewModels.Statistics
{
    public class SubmissionsStatisticsViewModel
    {
        public SubmissionsStatisticsViewModel(string month, int totalSubmissionsCount)
        {
            this.Month = month;
            this.TotalSubmissionsCount = totalSubmissionsCount;
        }

        public string Month { get; set; }

        public int TotalSubmissionsCount { get; set; }
    }
}