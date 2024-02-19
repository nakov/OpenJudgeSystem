namespace OJS.Services.Administration.Models.Problems;

public class AdditionalFilesDownloadModel
{
    public byte[]? Content { get; set; }

    public string? MimeType { get; set; }

    public string? FileName { get; set; }
}