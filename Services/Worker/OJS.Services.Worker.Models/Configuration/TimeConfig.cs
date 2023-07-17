namespace OJS.Services.Worker.Models.Configuration
{
    public class TimeConfig
    {
        public int DefaultTimeLimitInMs { get; set; } = 1000;

        public int HtmlAndCssDefaultTimeLimitInMs { get; set; } = 1000;
    }
}