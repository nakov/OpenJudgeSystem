namespace OJS.Services.Ui.Models.Participants;

using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemForParticipantServiceModel : IMapFrom<ProblemForParticipant>
{
    public int ProblemId { get; set; }

    public int ParticipantId { get; set; }
}