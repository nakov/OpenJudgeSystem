namespace OJS.Services.Common.Implementations;

using System;
using OJS.Services.Common.Models;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

public class ZipArchivesService : IZipArchivesService
{
    public async Task<byte[]> GetZipArchive(IEnumerable<InMemoryFile> files)
    {
        await using var archiveStream = new MemoryStream();
        using (var archive = new ZipArchive(archiveStream, ZipArchiveMode.Create, true))
        {
            foreach (var file in files.Where(f => f.Content != null))
            {
                var zipArchiveEntry = archive.CreateEntry(file.FileName, CompressionLevel.Optimal);
                await using var zipStream = zipArchiveEntry.Open();
                var buffer = file.Content.AsMemory(0, file.Content.Length);
                await zipStream.WriteAsync(buffer);
            }
        }

        return archiveStream.ToArray();
    }
}