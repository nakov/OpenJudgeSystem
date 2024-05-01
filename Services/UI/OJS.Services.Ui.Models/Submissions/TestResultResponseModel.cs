namespace OJS.Services.Ui.Models.Submissions
{
    using OJS.Services.Infrastructure.Models.Mapping;

    public class TestResultResponseModel : IMapFrom<TestRunServiceModel>
    {
        public int Id { get; set; }

        public string ResultType { get; set; } = null!;

        public int TimeUsed { get; set; }

        public int MemoryUsed { get; set; }
    }
}