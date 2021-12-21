namespace OJS.Services.Administration.Business;

using ICSharpCode.SharpZipLib.Zip;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using SoftUni.Services.Infrastructure;
using System.IO;

public interface IZippedTestsParserService : IService
{
    TestsParseResult Parse(Stream stream);

    int AddTestsToProblem(Problem problem, TestsParseResult tests);

    string ExtractFileFromStream(ZipEntry entry);

    bool AreTestsParsedCorrectly(TestsParseResult tests);
}