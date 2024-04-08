namespace OJS.Servers.Ui.Models.Contests;

using OJS.Services.Ui.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ContestParticipantResultResponseModel : IMapFrom<ContestParticipantResultServiceModel>
{
    public int CompetePoints { get; set; }

    public int PracticePoints { get; set; }
}