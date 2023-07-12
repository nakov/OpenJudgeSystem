namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Participants;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ParticipantSubmissionResultsServiceModel : IMapFrom<Participant>
{
    public int Id { get; set; }
}