namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionForContestParticipations : IMapFrom<Submission>
{
    public int Points { get; set; }

    public bool IsDeleted { get; set; }

    public int ProblemId { get; set; }
}