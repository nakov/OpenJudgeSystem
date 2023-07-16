namespace OJS.Services.Worker.Models.Configuration
{
    public class SubmissionExecutionConfig
    {
        public int OutputResultMaxLength { get; set; } = 1000;

        public TimeConfig TimeConfig { get; set; } = new TimeConfig();

        public MemoryConfig MemoryConfig { get; set; } = new MemoryConfig();
    }
}
