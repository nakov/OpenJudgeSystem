namespace OJS.Services.Common;

using SoftUni.Services.Infrastructure;

public interface IFileIoService : IService
{
    void CreateDirectory(string directoryPath);

    string CreateTempDirectory();

    bool DirectoryExists(string directoryPath);

    void SafeDeleteDirectory(string path, bool recursive = false);
}