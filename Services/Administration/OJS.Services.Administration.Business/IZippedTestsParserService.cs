namespace OJS.Services.Administration.Business;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Infrastructure;
using System.IO;
using System.Threading.Tasks;

public interface IZippedTestsParserService : IService
{
    Task<TestsParseResult> Parse(Stream stream);

    int AddTestsToProblem(Problem problem, TestsParseResult tests);

    bool AreTestsParsedCorrectly(TestsParseResult tests);
}