namespace OJS.Services.Common;

using SoftUni.Services.Infrastructure;

public interface IContentTypesService : IService
{
    string GetByFileExtension(string? fileExtension);
}