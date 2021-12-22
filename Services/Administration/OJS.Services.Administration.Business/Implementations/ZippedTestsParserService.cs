namespace OJS.Services.Administration.Business.Implementations;

using ICSharpCode.SharpZipLib.Zip;
using OJS.Common;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using System;
using System.IO;
using System.IO.Compression;
using static OJS.Common.GlobalConstants.FileExtensions;

public class ZippedTestsParserService : IZippedTestsParserService
{
    public TestsParseResult Parse(Stream stream)
    {
        var zipArchive = new ZipArchive(stream, ZipArchiveMode.Read);

        var result = new TestsParseResult();

        ExtractTxtFiles(zipArchive, result);

        return result;
    }

    public int AddTestsToProblem(Problem problem, TestsParseResult tests)
        => throw new System.NotImplementedException();

    public string ExtractFileFromStream(ZipEntry entry)
        => throw new System.NotImplementedException();

    public bool AreTestsParsedCorrectly(TestsParseResult tests)
        => throw new System.NotImplementedException();

    private static void ExtractTxtFiles(ZipArchive zipArchive, TestsParseResult result)
    {
        // var outOutputs = zipFile.GetZipEntriesByExtensions(TestOutputTxtFileExtension);
        //
        // foreach (var output in outOutputs)
        // {
        //     var input = GetInputByOutputAndExtension(zipFile, output, TestInputTxtFileExtension);
        //
        //     if (IsStandardZeroTest(input, output))
        //     {
        //         result.ZeroInputs.Add(ExtractFileFromStream(input));
        //         result.ZeroOutputs.Add(ExtractFileFromStream(output));
        //     }
        //     else if (IsStandardOpenTest(input, output))
        //     {
        //         result.OpenInputs.Add(ExtractFileFromStream(input));
        //         result.OpenOutputs.Add(ExtractFileFromStream(output));
        //     }
        //     else
        //     {
        //         result.Inputs.Add(ExtractFileFromStream(input));
        //         result.Outputs.Add(ExtractFileFromStream(output));
        //     }
        // }
    }
}