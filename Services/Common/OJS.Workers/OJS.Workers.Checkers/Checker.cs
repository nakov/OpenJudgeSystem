#nullable disable
namespace OJS.Workers.Checkers
{
    using System;
    using System.IO;
    using System.Reflection;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Extensions;
    using OJS.Workers.Common.Helpers;
    using System.Globalization;
    using static OJS.Workers.Common.Constants;

    public abstract class Checker : IChecker
    {
        protected Checker() => this.IgnoreCharCasing = false;

        protected bool IgnoreCharCasing { get; set; }

        public static IChecker CreateChecker(string assemblyName, string typeName, string parameter)
        {
            var assemblyFilePath = FileHelpers.BuildPath(
                AppDomain.CurrentDomain.BaseDirectory,
                $"{assemblyName}{ClassLibraryFileExtension}");

            var assembly = Assembly.LoadFile(assemblyFilePath);
            var type = assembly.GetType($"{assemblyName}.{typeName}");
            var checker = (IChecker)Activator.CreateInstance(type);

            if (!string.IsNullOrEmpty(parameter))
            {
                checker.SetParameter(parameter);
            }

            return checker;
        }

        public abstract CheckerResult Check(
            string inputData,
            string receivedOutput,
            string expectedOutput,
            bool isTrialTest);

        public virtual void SetParameter(string parameter)
            => throw new InvalidOperationException("This checker doesn't support parameters");

        protected static void NormalizeEndLines(ref string output)
        {
            if (!output?.EndsWith('\n') == true)
            {
                output += "\n";
            }
        }

        protected static bool AreEqualExactLines(string userLine, string correctLine)
            => userLine.Equals(correctLine, StringComparison.InvariantCulture);

        protected static bool AreEqualTrimmedLines(string userLine, string correctLine)
            => userLine.Trim().Equals(correctLine.Trim(), StringComparison.InvariantCulture);

        protected static bool AreEqualEndTrimmedLines(string userLine, string correctLine)
            => userLine.TrimEnd().Equals(correctLine.TrimEnd(), StringComparison.InvariantCulture);

        protected static bool AreEqualCaseInsensitiveLines(string userLine, string correctLine)
            => userLine.ToLower().Equals(correctLine.ToLower(), StringComparison.InvariantCulture);

        protected CheckerResult CheckLineByLine(
            string inputData,
            string receivedOutput,
            string expectedOutput,
            Func<string, string, bool> areEqual,
            bool isTrialTest)
        {
            NormalizeEndLines(ref receivedOutput);
            NormalizeEndLines(ref expectedOutput);

            var userFileReader = new StringReader(receivedOutput ?? string.Empty);
            var correctFileReader = new StringReader(expectedOutput ?? string.Empty);

            CheckerResultType resultType;

            var adminCheckerDetails = default(CheckerDetails);
            var lineNumber = 0;
            using (userFileReader)
            {
                using (correctFileReader)
                {
                    while (true)
                    {
                        var userLine = userFileReader.ReadLine();
                        var correctLine = correctFileReader.ReadLine();

                        if (userLine == null && correctLine == null)
                        {
                            // No more lines in both streams
                            resultType = CheckerResultType.Ok;
                            break;
                        }

                        if (userLine == null || correctLine == null)
                        {
                            // One of the two streams is already empty
                            adminCheckerDetails = this.PrepareAdminCheckerDetailsForInvalidNumberOfLines(
                                lineNumber,
                                userLine,
                                correctLine);
                            resultType = CheckerResultType.InvalidNumberOfLines;
                            break;
                        }

                        if (!areEqual(userLine, correctLine))
                        {
                            // Lines are different => wrong answer
                            adminCheckerDetails = this.PrepareAdminCheckerDetailsForDifferentLines(
                                lineNumber,
                                correctLine,
                                userLine);
                            resultType = CheckerResultType.WrongAnswer;
                            break;
                        }

                        lineNumber++;
                    }
                }
            }

            var checkerDetails = new CheckerDetails();
            if (resultType != CheckerResultType.Ok)
            {
                checkerDetails = this.PrepareCheckerDetails(receivedOutput, expectedOutput, isTrialTest, adminCheckerDetails);
            }

            return new CheckerResult
            {
                IsCorrect = resultType == CheckerResultType.Ok,
                ResultType = resultType,
                CheckerDetails = checkerDetails,
            };
        }

        protected virtual CheckerDetails PrepareAdminCheckerDetailsForDifferentLines(
            int lineNumber,
            string correctLine,
            string userLine)
        {
            const int fragmentMaxLength = 512;

            var adminCheckerDetails = new CheckerDetails
            {
                Comment = $"Line {lineNumber} is different.",
            };

            var firstDifferenceIndex = correctLine.GetFirstDifferenceIndexWith(userLine, this.IgnoreCharCasing);

            if (correctLine != null)
            {
                adminCheckerDetails.ExpectedOutputFragment =
                    PrepareOutputFragment(correctLine, firstDifferenceIndex, fragmentMaxLength);
            }

            if (userLine != null)
            {
                adminCheckerDetails.UserOutputFragment =
                    PrepareOutputFragment(userLine, firstDifferenceIndex, fragmentMaxLength);
            }

            return adminCheckerDetails;
        }

        protected virtual CheckerDetails PrepareAdminCheckerDetailsForInvalidNumberOfLines(
            int lineNumber,
            string userLine,
            string correctLine)
        {
            const int fragmentMaxLength = 512;

            var adminCheckerDetails = new CheckerDetails
            {
                Comment = $"Invalid number of lines on line {lineNumber}",
            };

            var firstDifferenceIndex = correctLine.GetFirstDifferenceIndexWith(userLine, this.IgnoreCharCasing);

            if (correctLine != null)
            {
                adminCheckerDetails.ExpectedOutputFragment =
                    PrepareOutputFragment(correctLine, firstDifferenceIndex, fragmentMaxLength);
            }

            if (userLine != null)
            {
                adminCheckerDetails.UserOutputFragment =
                    PrepareOutputFragment(userLine, firstDifferenceIndex, fragmentMaxLength);
            }

            return adminCheckerDetails;
        }

        protected virtual CheckerDetails PrepareCheckerDetails(
            string receivedOutput,
            string expectedOutput,
            bool isTrialTest,
            CheckerDetails adminCheckerDetails)
        {
            CheckerDetails checkerDetails;
            if (isTrialTest)
            {
                const int fragmentMaxLength = 4096;

                checkerDetails = new CheckerDetails();

                var firstDifferenceIndex = expectedOutput.GetFirstDifferenceIndexWith(receivedOutput, this.IgnoreCharCasing);

                if (expectedOutput != null)
                {
                    checkerDetails.ExpectedOutputFragment =
                        PrepareOutputFragment(expectedOutput, firstDifferenceIndex, fragmentMaxLength);
                }

                if (receivedOutput != null)
                {
                    checkerDetails.UserOutputFragment =
                        PrepareOutputFragment(receivedOutput, firstDifferenceIndex, fragmentMaxLength);
                }
            }
            else
            {
                // Test report for admins
                checkerDetails = adminCheckerDetails;
            }

            return checkerDetails;
        }

        private static string PrepareOutputFragment(string output, int firstDifferenceIndex, int fragmentMaxLength)
        {
            var fragmentStartIndex = Math.Max(firstDifferenceIndex - (fragmentMaxLength / 2), 0);
            var fragmentEndIndex = Math.Min(firstDifferenceIndex + (fragmentMaxLength / 2), output.Length);

            var fragment = output.GetStringWithEllipsisBetween(fragmentStartIndex, fragmentEndIndex);

            return fragment;
        }
    }
}
