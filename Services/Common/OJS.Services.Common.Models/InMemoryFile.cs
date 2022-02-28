namespace OJS.Services.Common.Models;

using OJS.Common.Extensions.Strings;

public class InMemoryFile
{
    public InMemoryFile()
    {
    }

    public InMemoryFile(string fileName, string content)
    {
        this.FileName = fileName;
        this.Content = content.ToByteArray();
    }

    public string FileName { get; set; } = string.Empty;

    public byte[]? Content { get; set; }
}