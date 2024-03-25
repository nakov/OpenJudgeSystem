namespace OJS.Services.Common.Models.Files;

public class FileResponseModel
{
    public FileResponseModel()
    {
    }

    public FileResponseModel(byte[]? content, string? fileName, string? mimeType)
    {
        this.Content = content;
        this.FileName = fileName;
        this.MimeType = mimeType;
    }

    public byte[]? Content { get; set; }

    public string? MimeType { get; set; }

    public string? FileName { get; set; }
}