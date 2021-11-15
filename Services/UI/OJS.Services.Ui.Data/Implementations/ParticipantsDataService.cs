namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Data.Infrastructure.Implementations;

    public class ParticipantsDataService : DataService<Participant>, IParticipantsDataService
    {
        public ParticipantsDataService(OjsDbContext db) : base(db)
        {
        }
    }
}