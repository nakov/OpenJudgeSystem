namespace OJS.Workers.Common
{
    public class CheckerDetails
    {
        public string? Comment { get; set; } = string.Empty;

        public string? ExpectedOutputFragment { get; set; } = string.Empty;

        public string? UserOutputFragment { get; set; } = string.Empty;
    }
}