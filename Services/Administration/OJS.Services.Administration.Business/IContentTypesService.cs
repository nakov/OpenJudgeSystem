namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;

public interface IContentTypesService : IService
{
    string GetByFileExtension(string? fileExtension);
}