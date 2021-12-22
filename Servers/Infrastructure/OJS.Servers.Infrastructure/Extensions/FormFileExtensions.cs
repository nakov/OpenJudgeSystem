namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

public static class FormFileExtensions
{
    public static async Task<byte[]> ToByteArray(this IFormFile formFile)
    {
        await using var memoryStream = new MemoryStream();
        await formFile.CopyToAsync(memoryStream);
        return memoryStream.ToArray();
    }
}