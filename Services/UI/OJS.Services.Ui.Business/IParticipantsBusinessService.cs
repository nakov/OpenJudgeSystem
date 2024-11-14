namespace OJS.Services.Ui.Business
{
    using System.Threading.Tasks;
    using OJS.Data.Models.Participants;
    using OJS.Services.Infrastructure;
    using OJS.Services.Ui.Models.Contests;

    public interface IParticipantsBusinessService : IService
    {
        Task<Participant> CreateNewByContestByUserByIsOfficialAndIsAdminOrLecturer(
            ContestRegistrationDetailsServiceModel contest,
            string userId,
            bool isOfficial,
            bool isAdminOrLecturerInContest);
    }
}