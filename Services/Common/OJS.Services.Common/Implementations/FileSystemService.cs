namespace OJS.Services.Common.Implementations;

using Microsoft.AspNetCore.Http;
using System.IO;

public class FileSystemService : IFileSystemService
{
    public string GetFileExtension(IFormFile file)
        => Path.GetExtension(file.FileName);
}