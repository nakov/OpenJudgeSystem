namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Data.Infrastructure.Implementations;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class ParticipantsDataService : DataService<Participant>, IParticipantsDataService
    {
        public ParticipantsDataService(OjsDbContext db) : base(db)
        {
        }

        public async Task Delete(IEnumerable<Participant> participantsForDeletion)
        {
            foreach (var participant in participantsForDeletion)
            {
                this.Delete(participant);
            }

            await this.SaveChanges();
        }
    }
}