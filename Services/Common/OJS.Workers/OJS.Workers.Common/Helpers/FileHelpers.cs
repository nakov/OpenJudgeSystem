﻿namespace OJS.Workers.Common.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    using Ionic.Zip;
    using OJS.Workers.Common.Exceptions;
    using Zip = System.IO.Compression.ZipFile;

    // TODO: Unit test
    public static class FileHelpers
    {
        public static string SaveStringToFile(string stringToWrite, string filePath)
        {
            File.WriteAllText(filePath, stringToWrite);
            return filePath;
        }

        public static string SaveStringToTempFile(string directory, string stringToWrite)
        {
            var tempFilePath = Path.GetTempFileName();
            File.Delete(tempFilePath);
            var fullTempFilePath = Path.Combine(directory, Path.GetFileName(tempFilePath));
            File.WriteAllText(fullTempFilePath, stringToWrite);
            return fullTempFilePath;
        }

        public static string SaveByteArrayToTempFile(string directory, byte[] dataToWrite)
        {
            var tempFilePath = Path.GetTempFileName();
            File.Delete(tempFilePath);
            var fullTempFilePath = Path.Combine(directory, Path.GetFileName(tempFilePath));
            File.WriteAllBytes(fullTempFilePath, dataToWrite);
            return fullTempFilePath;
        }

        public static void UnzipFile(string fileToUnzip, string outputDirectory)
            => Zip.ExtractToDirectory(fileToUnzip, outputDirectory);

        public static void UnzipFileAndOverwriteExistingFiles(string fileToUnzip, string outputDirectory)
            => Zip.ExtractToDirectory(fileToUnzip, outputDirectory, overwriteFiles: true);

        public static string FindFileMatchingPattern(string workingDirectory, string pattern)
        {
            var files = DiscoverAllFilesMatchingPattern(workingDirectory, pattern);

            var discoveredFile = files.First();

            return ProcessModulePath(discoveredFile);
        }

        public static string FindFileMatchingPattern<TOut>(
            string workingDirectory,
            string pattern,
            Func<string, TOut> orderBy)
        {
            var files = DiscoverAllFilesMatchingPattern(workingDirectory, pattern);

            var discoveredFile = files.OrderByDescending(orderBy).First();

            return ProcessModulePath(discoveredFile);
        }

        public static IEnumerable<string> FindAllFilesMatchingPattern(
            string workingDirectory,
            string pattern)
        {
            var files = DiscoverAllFilesMatchingPattern(workingDirectory, pattern);

            return files.Select(ProcessModulePath).ToList();
        }

        public static void AddFilesToZipArchive(string archivePath, string pathInArchive, params string[] filePaths)
        {
            using var zipFile = new ZipFile(archivePath);
            zipFile.UpdateFiles(filePaths, pathInArchive);
            zipFile.Save();
        }

        public static IEnumerable<string> GetFilePathsFromZip(string archivePath)
        {
            using var file = new ZipFile(archivePath);
            return file.EntryFileNames;
        }

        public static void RemoveFilesFromZip(string pathToArchive, string pattern)
        {
            using var file = new ZipFile(pathToArchive);
            file.RemoveSelectedEntries(pattern);
            file.Save();
        }

        public static void DeleteFiles(params string[] filePaths)
        {
            foreach (var filePath in filePaths)
            {
                DeleteFile(filePath);
            }
        }

        public static void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        public static string ReadFile(string filePath)
            => File.ReadAllText(filePath);

        public static string ExtractFileFromZip(string pathToArchive, string fileName, string destinationDirectory)
        {
            using var zip = new ZipFile(pathToArchive);

            var entryToExtract = zip.Entries.FirstOrDefault(f => f.FileName.EndsWith(fileName));
            if (entryToExtract == null)
            {
                throw new SolutionException($"The file \"{fileName}\" was not found in the submission!");
            }

            entryToExtract.Extract(destinationDirectory);

            var extractedFilePath = $"{destinationDirectory}{Path.DirectorySeparatorChar}{entryToExtract.FileName.Replace("/", Path.DirectorySeparatorChar.ToString())}";

            return extractedFilePath;
        }

        public static bool FileExistsInZip(string pathToArchive, string fileName)
        {
            using var zip = new ZipFile(pathToArchive);
            var entryToExtract = zip.Entries.FirstOrDefault(f => f.FileName.EndsWith(fileName));
            if (entryToExtract == null)
            {
                return false;
            }

            return true;
        }

        public static string ProcessModulePath(string path) => path.Replace('\\', '/');

        public static string BuildPath(params string[] paths) => Path.Combine(paths);

        public static string BuildSubmissionLogFilePath(int submissionId)
            => Path.Combine(Path.GetTempPath(), $"submission-{submissionId}.log");

        public static void WriteAllText(string filePath, string text)
            => File.WriteAllText(filePath, text);

        public static void WriteAllBytes(string filePath, byte[] data)
            => File.WriteAllBytes(filePath, data);

        public static bool FileExists(string filePath) => File.Exists(filePath);

        public static async Task<byte[]> ReadFileUpToBytes(string filePath, int maxBytes)
        {
            // If the file is less than 10 MB, read the entire file
            var fileInfo = new FileInfo(filePath);
            if (fileInfo.Length <= maxBytes)
            {
                return await File.ReadAllBytesAsync(filePath);
            }

            // Otherwise, read only the first 10 MB
            var buffer = new byte[maxBytes];
            await using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            await stream.ReadExactlyAsync(buffer, 0, maxBytes);
            return buffer;
        }

        private static List<string> DiscoverAllFilesMatchingPattern(string workingDirectory, string pattern)
        {
            var files = new List<string>(
                Directory.GetFiles(
                    workingDirectory,
                    pattern,
                    SearchOption.AllDirectories));

            if (files.Count == 0)
            {
                throw new SolutionException($"A file following the pattern '{pattern}' was not found in the submission!");
            }

            return files;
        }
    }
}
