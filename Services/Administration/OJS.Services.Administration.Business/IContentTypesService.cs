namespace OJS.Services.Administration.Business;

using OJS.Services.Infrastructure;

public interface IContentTypesService : IService
{
    string GetByFileExtension(string? fileExtension);
}