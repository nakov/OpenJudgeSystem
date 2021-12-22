namespace OJS.Common.Extensions;

using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

public static class ZipArchiveExtensions
{
    public static IEnumerable<ZipArchiveEntry> GetZipEntriesByExtensions(this ZipArchive zipArchive, string extensions)
        => zipArchive
            .GetEntriesSorted()
            .Where(ze =>
                ze.Name.Length > extensions.Length &&
                ze.Name
                    .Substring(ze.Name.Length - extensions.Length, extensions.Length)
                    .Equals(extensions, StringComparison.OrdinalIgnoreCase));

    public static async Task<string> ReadText(this ZipArchiveEntry entry)
    {
        await using var stream = entry.Open();
        using var streamReader = new StreamReader(stream);
        var text = await streamReader.ReadToEndAsync();
        return text;
    }

    public static IEnumerable<ZipArchiveEntry> GetEntriesSorted(this ZipArchive zipArchive)
        => zipArchive
            .Entries
            .OrderBy(e => e.Name)
            .ToList();
}