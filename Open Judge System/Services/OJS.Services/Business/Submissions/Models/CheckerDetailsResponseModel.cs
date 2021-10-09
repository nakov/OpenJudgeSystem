namespace OJS.Services.Busines.Submissions.Models
{
    public class CheckerDetailsResponseModel
    {
        public string Comment { get; set; }

        public string ExpectedOutputFragment { get; set; }

        public string UserOutputFragment { get; set; }
    }
}