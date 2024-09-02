namespace OJS.Servers.Ui.Models.Submissions.Profile
{
    using OJS.Services.Ui.Models.Submissions;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ProblemResponseModel : IMapFrom<ProblemServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public int MaximumPoints { get; set; }

        public double OrderBy { get; set; }
    }
}