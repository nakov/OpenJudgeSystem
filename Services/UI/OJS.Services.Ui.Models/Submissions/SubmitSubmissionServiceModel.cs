namespace OJS.Services.Ui.Models.Submissions;

public class SubmitSubmissionServiceModel
{
    public int ProblemId { get; set; }

    public int SubmissionTypeId { get; set; }

    public string Content { get; set; } = null!;

    public bool Official { get; set; }
}