namespace OJS.Services.Common.Implementations;

using Microsoft.AspNetCore.Http;
using System.IO;

public class FileSystemService : IFileSystemService
{
    public string GetFileExtension(IFormFile file)
        => Path.GetExtension(file.FileName);

    public string BuildPath(params string[] paths)
        => Path.Combine(paths);

    public string GetRandomFileName()
        => Path.GetRandomFileName();

    public string GetTempPath()
        => Path.GetTempPath();
}