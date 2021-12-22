namespace OJS.Services.Common.Implementations;

using System.IO;

public class FileIoService : IFileIoService
{
    private readonly IFileSystemService fileSystem;

    public FileIoService(IFileSystemService fileSystem)
        => this.fileSystem = fileSystem;

    public void CreateDirectory(string directoryPath)
        => Directory.CreateDirectory(directoryPath);

    public string CreateTempDirectory()
    {
        while (true)
        {
            var randomDirectoryName = this.fileSystem.GetRandomFileName();
            var path = this.fileSystem.BuildPath(this.fileSystem.GetTempPath(), randomDirectoryName);
            if (this.DirectoryExists(path))
            {
                continue;
            }

            this.CreateDirectory(path);
            return path;
        }
    }

    public bool DirectoryExists(string directoryPath)
        => Directory.Exists(directoryPath);

    public void SafeDeleteDirectory(string path, bool recursive = false)
    {
        if (!this.DirectoryExists(path))
        {
            return;
        }

        var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;

        foreach (var fileSystemEntry in Directory.EnumerateFileSystemEntries(path, "*", searchOption))
        {
            File.SetAttributes(fileSystemEntry, FileAttributes.Normal);
        }

        Directory.Delete(path, recursive);
    }
}