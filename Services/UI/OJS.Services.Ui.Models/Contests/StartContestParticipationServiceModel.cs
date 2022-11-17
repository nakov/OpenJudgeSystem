namespace OJS.Services.Ui.Models.Contests
{
    public class StartContestParticipationServiceModel
    {
        public int ContestId { get; set; }

        public bool IsOfficial { get; set; }

        public string UserHostAddress { get; set; } = null!;
    }
}