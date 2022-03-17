namespace OJS.Services.Common.Implementations;

using static OJS.Common.GlobalConstants;

public class ContentTypesService : IContentTypesService
{
    public string GetByFileExtension(string? fileExtension)
    {
        fileExtension = fileExtension?.StartsWith('.') ?? false
            ? fileExtension
            : $".{fileExtension}";

        return fileExtension switch
        {
            FileExtensions.Zip => MimeTypes.ApplicationZip,
            FileExtensions.Txt => MimeTypes.Plain,
            FileExtensions.Docx => MimeTypes.Docx,
            _ => MimeTypes.ApplicationUnknown,
        };
    }
}