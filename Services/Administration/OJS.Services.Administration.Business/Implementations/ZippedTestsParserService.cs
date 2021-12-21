namespace OJS.Services.Administration.Business.Implementations;

using ICSharpCode.SharpZipLib.Zip;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using System.IO;

public class ZippedTestsParserService : IZippedTestsParserService
{
    public TestsParseResult Parse(Stream stream)
        => throw new System.NotImplementedException();

    public int AddTestsToProblem(Problem problem, TestsParseResult tests)
        => throw new System.NotImplementedException();

    public string ExtractFileFromStream(ZipEntry entry)
        => throw new System.NotImplementedException();

    public bool AreTestsParsedCorrectly(TestsParseResult tests)
        => throw new System.NotImplementedException();
}