namespace OJS.Services.Administration.Business.Implementations;

using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using System.Collections.Generic;
using OJS.Data.Models.Tests;
using OJS.Services.Common.Helpers;
using OJS.Common.Extensions;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Common;
using static OJS.Common.GlobalConstants;
using static OJS.Common.GlobalConstants.FileExtensions;

public class ZippedTestsParserService : IZippedTestsParserService
{
    private const string InvalidNameForInputTestErrorMessage = "Invalid input test name";
    private const string InvalidInputTestsCountErrorMessage = "Invalid count of input tests ";

    private readonly IFileIoService fileIo;

    public ZippedTestsParserService(IFileIoService fileIo)
        => this.fileIo = fileIo;

    public async Task<TestsParseResult> Parse(Stream stream)
    {
        var zipArchive = new ZipArchive(stream, ZipArchiveMode.Read);

        var result = new TestsParseResult();

        await ExtractInAndSolFiles(zipArchive, result);
        await ExtractInAndOutFiles(zipArchive, result);
        await ExtractTxtFiles(zipArchive, result);
        await ExtractIoiFiles(zipArchive, result);
        await this.ExtractZipFiles(zipArchive, result);

        return result;
    }

    public int AddTestsToProblem(Problem problem, TestsParseResult tests)
    {
        var tryOptimizeMysqlQuery = ShouldTryOptimizeMysqlQuery(problem);

        var lastTrialTest = problem.Tests
            .Where(x => x.IsTrialTest)
            .MaxBy(x => x.OrderBy);

        var zeroTestsOrder = 1.0;

        if (lastTrialTest != null)
        {
            zeroTestsOrder = lastTrialTest.OrderBy + 1;
        }

        AddTests(problem, tests.ZeroInputs, tests.ZeroOutputs, tryOptimizeMysqlQuery, true, zeroTestsOrder.ToInt());

        var lastTest = problem.Tests
            .Where(x => !x.IsTrialTest)
            .MaxBy(x => x.OrderBy);

        var orderBy = 1.0;

        if (lastTest != null)
        {
            orderBy = lastTest.OrderBy + 1;
        }

        AddTests(problem, tests.OpenInputs, tests.OpenOutputs, tryOptimizeMysqlQuery, false, orderBy.ToInt());

        AddTests(problem, tests.Inputs, tests.Outputs, tryOptimizeMysqlQuery, false, orderBy.ToInt());

        return tests.ZeroInputs.Count + tests.OpenInputs.Count + tests.Inputs.Count;
    }

    public bool AreTestsParsedCorrectly(TestsParseResult tests)
    {
        var hasInputs = tests.ZeroInputs.Count != 0 ||
                        tests.Inputs.Count != 0 ||
                        tests.OpenInputs.Count != 0;

        var hasEqualAmountOfInputsAndOutputs = tests.ZeroInputs.Count == tests.ZeroOutputs.Count &&
                                               tests.Inputs.Count == tests.Outputs.Count &&
                                               tests.OpenInputs.Count == tests.OpenOutputs.Count;

        return hasInputs && hasEqualAmountOfInputsAndOutputs;
    }

    private static bool ShouldTryOptimizeMysqlQuery(Problem problem)
    {
        try
        {
            return problem.SubmissionTypesInProblems
                .Any(
                    st => MySqlStrategiesHelper.ExecutionStrategyTypesForOptimization
                        .Any(x => x == st.SubmissionType.ExecutionStrategyType));
        }
        catch (NullReferenceException)
        {
            // new problem
            return false;
        }
    }

    private static string GetInputData(string input, bool optimizeMysqlQuery)
    {
        if (!optimizeMysqlQuery)
        {
            return input;
        }

        return MySqlStrategiesHelper.TryOptimizeQuery(input, out var newInput) ? newInput : input;
    }

    private static void AddTests(
        Problem problem,
        IEnumerable<string> testsInputs,
        IEnumerable<string> testOutputs,
        bool tryOptimizeMysqlQuery,
        bool isTrialTests,
        int orderBy)
        => testsInputs.ForEach((index, testInput) =>
        {
            problem.Tests.Add(new Test
            {
                IsTrialTest = isTrialTests,
                OrderBy = orderBy++,
                Problem = problem,
                InputDataAsString = GetInputData(testInput, tryOptimizeMysqlQuery),
                OutputDataAsString = testOutputs.ElementAt(index),
            });
        });

    private static async Task ExtractTxtFiles(ZipArchive zipFile, TestsParseResult result)
    {
        var outOutputs = zipFile.GetZipEntriesByExtensions(TestOutputTxt);

        foreach (var output in outOutputs)
        {
            var input = GetInputByOutputAndExtension(zipFile, output, TestInputTxt);

            if (IsStandardZeroTest(input, output))
            {
                result.ZeroInputs.Add(await input.ReadText());
                result.ZeroOutputs.Add(await output.ReadText());
            }
            else if (IsStandardOpenTest(input, output))
            {
                result.OpenInputs.Add(await input.ReadText());
                result.OpenOutputs.Add(await output.ReadText());
            }
            else
            {
                result.Inputs.Add(await input.ReadText());
                result.Outputs.Add(await output.ReadText());
            }
        }
    }

    private static async Task ExtractInAndSolFiles(ZipArchive zipFile, TestsParseResult result)
    {
        var solOutputs = zipFile.GetZipEntriesByExtensions(Sol);

        foreach (var output in solOutputs)
        {
            var input = GetInputByOutputAndExtension(zipFile, output, Input);

            var zeroTestInputSignature = $"00{Input}";
            var zeroTestOutputSignature = $"00{Sol}";

            var isZeroTest =
                input.Name
                    .Substring(
                        input.Name.Length - zeroTestInputSignature.Length,
                        zeroTestInputSignature.Length)
                    .Equals(zeroTestInputSignature, StringComparison.OrdinalIgnoreCase) &&
                output.Name
                    .Substring(
                        output.Name.Length - zeroTestOutputSignature.Length,
                        zeroTestOutputSignature.Length)
                    .Equals(zeroTestOutputSignature, StringComparison.OrdinalIgnoreCase);

            if (isZeroTest)
            {
                result.ZeroInputs.Add(await input.ReadText());
                result.ZeroOutputs.Add(await output.ReadText());
            }
            else
            {
                result.Inputs.Add(await input.ReadText());
                result.Outputs.Add(await output.ReadText());
            }
        }
    }

    private static async Task ExtractInAndOutFiles(ZipArchive zipFile, TestsParseResult result)
    {
        var outOutputs = zipFile.GetZipEntriesByExtensions(Output);

        foreach (var output in outOutputs)
        {
            var input = GetInputByOutputAndExtension(zipFile, output, Input);

            const string zeroTestSignature = "et";

            var isZeroTest =
                input.Name
                    .Substring(
                        input.Name.LastIndexOf('_') - zeroTestSignature.Length,
                        zeroTestSignature.Length)
                    .Equals(zeroTestSignature, StringComparison.OrdinalIgnoreCase) &&
                output.Name
                    .Substring(
                        output.Name.LastIndexOf('_') - zeroTestSignature.Length,
                        zeroTestSignature.Length)
                    .Equals(zeroTestSignature, StringComparison.OrdinalIgnoreCase);

            if (isZeroTest)
            {
                result.ZeroInputs.Add(await input.ReadText());
                result.ZeroOutputs.Add(await output.ReadText());
            }
            else
            {
                result.Inputs.Add(await input.ReadText());
                result.Outputs.Add(await output.ReadText());
            }
        }
    }

    private static async Task ExtractIoiFiles(ZipArchive zipFile, TestsParseResult result)
    {
        // IOI test files
        if (zipFile.Entries.Any(x => char.IsNumber(x.Name[x.Name.LastIndexOf('.') + 1])))
        {
            const string outputFileSignature = "out";
            const string inputFileSignature = "in";

            var outOutputs = zipFile.GetEntriesSorted()
                .Where(x => x.Name
                    .Substring(
                        x.Name.LastIndexOf('.') - outputFileSignature.Length,
                        outputFileSignature.Length)
                    .Equals(outputFileSignature, StringComparison.OrdinalIgnoreCase))
                .ToList();

            foreach (var output in outOutputs)
            {
                var inputFileName = inputFileSignature + output.Name[output.Name.LastIndexOf('.')..];

                var input = GetUniqueInputByFileName(zipFile, inputFileName);

                result.Inputs.Add(await input.ReadText());
                result.Outputs.Add(await output.ReadText());
            }
        }
    }

    private static ZipArchiveEntry GetInputByOutputAndExtension(
        ZipArchive zipFile,
        ZipArchiveEntry output,
        string extension)
    {
        var fileName = output.Name[..(output.Name.Length - extension.Length - 1)] + extension;

        return GetUniqueInputByFileName(zipFile, fileName);
    }

    private static ZipArchiveEntry GetUniqueInputByFileName(ZipArchive zipFile, string fileName)
    {
        var files = zipFile.Entries
            .Where(x => x.Name.Equals(fileName, StringComparison.OrdinalIgnoreCase))
            .ToList();

        return files.Count switch
        {
            0 => throw new ArgumentException(InvalidNameForInputTestErrorMessage),
            > 1 => throw new ArgumentException(InvalidInputTestsCountErrorMessage),
            _ => files.First(),
        };
    }

    private static bool IsStandardZeroTest(ZipArchiveEntry input, ZipArchiveEntry output) =>
        input.Name.Contains(ZeroTestStandardSignature) &&
        output.Name.Contains(ZeroTestStandardSignature);

    private static bool IsStandardOpenTest(ZipArchiveEntry input, ZipArchiveEntry output) =>
        input.Name.Contains(OpenTestStandardSignature) &&
        output.Name.Contains(OpenTestStandardSignature);

    private async Task ExtractZipFiles(ZipArchive zipFile, TestsParseResult result)
    {
        // Java Unit Testing test files
        var outputs = zipFile.GetZipEntriesByExtensions(TestOutputZip).ToList();

        if (!outputs.Any())
        {
            return;
        }

        var tempDir = this.fileIo.CreateTempDirectory();

        foreach (var output in outputs)
        {
            var input = GetInputByOutputAndExtension(zipFile, output, TestInputZip);

            var inputAsText = new StringBuilder();
            var outputAsText = new StringBuilder();

            input.ExtractToFile(tempDir);
            output.ExtractToFile(tempDir);

            var inputFile = ZipFile.OpenRead($"{tempDir}\\{input.Name}");
            var outputFile = ZipFile.OpenRead($"{tempDir}\\{output.Name}");

            var inputEntries = inputFile.Entries.Where(x => !x.Name.EndsWith('/'));
            var outputEntries = outputFile.Entries.Where(x => !x.Name.EndsWith('/'));

            foreach (var entry in inputEntries)
            {
                inputAsText.Append(ClassDelimiterWin);
                inputAsText.AppendLine($"//{entry.Name}");
                inputAsText.AppendLine(await entry.ReadText());
            }

            foreach (var entry in outputEntries)
            {
                outputAsText.AppendLine(await entry.ReadText());
            }

            inputFile.Dispose();
            outputFile.Dispose();

            if (IsStandardZeroTest(input, output))
            {
                result.ZeroInputs.Add(inputAsText.ToString());
                result.ZeroOutputs.Add(outputAsText.ToString());
            }
            else if (IsStandardOpenTest(input, output))
            {
                result.OpenInputs.Add(inputAsText.ToString());
                result.OpenOutputs.Add(outputAsText.ToString());
            }
            else
            {
                result.Inputs.Add(inputAsText.ToString());
                result.Outputs.Add(outputAsText.ToString());
            }
        }

        this.fileIo.SafeDeleteDirectory(tempDir, true);
    }
}