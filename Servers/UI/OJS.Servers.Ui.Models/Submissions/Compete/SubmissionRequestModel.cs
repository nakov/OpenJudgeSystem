using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Servers.Ui.Models.Submissions.Compete;

public class SubmissionRequestModel : IMapTo<SubmitSubmissionServiceModel>
{
    public int ProblemId { get; set; }

    public int SubmissionTypeId { get; set; }

    public string Content { get; set; }

    public bool Official { get; set; }
}