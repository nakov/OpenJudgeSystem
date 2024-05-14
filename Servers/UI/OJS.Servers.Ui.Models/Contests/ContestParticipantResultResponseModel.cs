namespace OJS.Servers.Ui.Models.Contests;

using OJS.Services.Ui.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ContestParticipantResultResponseModel : IMapFrom<ContestParticipantResultServiceModel>
{
    public int? CompetePoints { get; set; }

    public int? PracticePoints { get; set; }
}