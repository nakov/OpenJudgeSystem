namespace OJS.Common.Extensions;

using Microsoft.AspNetCore.Http;
using System.IO;

public static class FormFileExtensions
{
    public static byte[] GetBytes(this IFormFile formFile)
    {
        using (var memoryStream = new MemoryStream())
        {
            formFile.CopyTo(memoryStream);
            return memoryStream.ToArray();
        }
    }
}