namespace OJS.Services.Ui.Models.Submissions;

public class SubmitSubmissionServiceModel
{
    public int ProblemId { get; set; }

    public int SubmissionTypeId { get; set; }

    public bool Official { get; set; }

    public byte[]? ByteContent { get; set; }

    public string? StringContent { get; set; }

    public string? FileExtension { get; set; }
}