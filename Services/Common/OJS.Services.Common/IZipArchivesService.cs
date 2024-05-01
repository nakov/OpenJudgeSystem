namespace OJS.Services.Common;

using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IZipArchivesService : IService
{
    Task<byte[]> GetZipArchive(IEnumerable<InMemoryFile> files);
}