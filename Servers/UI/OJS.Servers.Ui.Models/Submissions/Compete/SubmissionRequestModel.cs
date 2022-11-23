namespace OJS.Servers.Ui.Models.Submissions.Compete;

using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionRequestModel : IMapTo<SubmitSubmissionServiceModel>
{
    public int ProblemId { get; set; }

    public int SubmissionTypeId { get; set; }

    public string Content { get; set; } = null!;

    public bool Official { get; set; }
}