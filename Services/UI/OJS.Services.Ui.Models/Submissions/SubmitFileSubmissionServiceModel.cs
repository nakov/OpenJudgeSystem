using System.IO;

namespace OJS.Services.Ui.Models.Submissions;

public class SubmitFileSubmissionServiceModel
{
    public int ProblemId { get; set; }

    public int SubmissionTypeId { get; set; }

    public Stream Content { get; set; }

    public bool Official { get; set; }
}