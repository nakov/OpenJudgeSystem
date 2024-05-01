namespace OJS.Services.Ui.Models.Submissions
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ProblemServiceModel : IMapFrom<Problem>
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public short MaximumPoints { get; set; }

        public double OrderBy { get; set; }

        public bool ShowDetailedFeedback { get; set; }
    }
}