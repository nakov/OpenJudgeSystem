namespace OJS.Services.Administration.Business.Participants.GridData;

using OJS.Data.Models.Participants;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class ParticipantsGridDataService : GridDataService<Participant>, IParticipantsGridDataService
{
    public ParticipantsGridDataService(IDataService<Participant> dataService, ISortingService sortingService, IFilteringService filteringService)
        : base(dataService, sortingService, filteringService)
    {
    }
}