namespace OJS.Services.Common.Models;

public class InMemoryFile
{
    public string FileName { get; set; } = string.Empty;

    public byte[]? Content { get; set; }
}