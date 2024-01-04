namespace OJS.Workers.ExecutionStrategies.Helpers
{
    using System;
    using System.Text.RegularExpressions;

    using OJS.Workers.Common.Exceptions;

    using static OJS.Workers.Common.Constants;

    internal static class UnitTestStrategiesHelper
    {
        public const string TestedCodeFileName = "TestedCode";

#pragma warning disable SA1307
#pragma warning disable SA1311
        public static readonly string testedCodeFileNameWithExtension =
#pragma warning restore SA1311
#pragma warning restore SA1307
            $"{TestedCodeFileName}{cSharpFileExtension}";

        /// <summary>
        /// Gets the output message and the count of the original tests passed,
        /// by running the provided regex on the received output from the execution process.
        /// </summary>
        /// <param name="receivedOutput">The output from the console runner.</param>
        /// <param name="regex">The Regex used to catch the passing and failing tests.</param>
        /// <param name="originalTestsPassed">The number of unit tests that have passed on the first test.</param>
        /// <param name="isFirstTest">Bool indicating if the results are for the first test.</param>
        /// <param name="testsCountExtractor">The function which extracts total and passed tests count from the MatchCollection.</param>
        public static (string message, int originalTestsPassed) GetTestResult(
            string receivedOutput,
            Regex regex,
            int originalTestsPassed,
            bool isFirstTest,
            Func<MatchCollection, (int totalTests, int passedTests)> testsCountExtractor)
        {
            var matches = regex.Matches(receivedOutput);
            if (matches.Count == 0)
            {
                throw new InvalidProcessExecutionOutputException();
            }

            var (totalTests, passedTests) = testsCountExtractor(matches);

            var message = TestPassedMessage;

            if (totalTests == 0)
            {
                message = "No tests found";
            }
            else if (passedTests >= originalTestsPassed)
            {
                message = "No functionality covering this test!";
            }

            if (isFirstTest)
            {
                originalTestsPassed = passedTests;

                if (totalTests != passedTests)
                {
                    message = "Not all tests passed on the correct solution.";
                }
                else
                {
                    message = TestPassedMessage;
                }
            }

            return (message, originalTestsPassed);
        }
    }
}
