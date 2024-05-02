namespace OJS.Services.Worker.Models.Configuration
{
    using OJS.Services.Infrastructure.Configurations;

    public class SubmissionExecutionConfig : BaseConfig
    {
        public override string SectionName => "SubmissionExecution";

        public int OutputResultMaxLength { get; set; } = 1000;

        public TimeConfig TimeConfig { get; set; } = new TimeConfig();

        public MemoryConfig MemoryConfig { get; set; } = new MemoryConfig();
    }
}
