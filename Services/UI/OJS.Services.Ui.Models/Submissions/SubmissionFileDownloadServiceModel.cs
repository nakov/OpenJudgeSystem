namespace OJS.Services.Ui.Models.Submissions;

public class SubmissionFileDownloadServiceModel
{
    public byte[]? Content { get; set; }

    public string? MimeType { get; set; }

    public string? FileName { get; set; }
}