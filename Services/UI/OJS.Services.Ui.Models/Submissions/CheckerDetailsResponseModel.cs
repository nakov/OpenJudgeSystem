namespace OJS.Services.Ui.Models.Submissions
{
    public class CheckerDetailsResponseModel
    {
        public string Comment { get; set; } = null!;

        public string ExpectedOutputFragment { get; set; } = null!;

        public string UserOutputFragment { get; set; } = null!;
    }
}