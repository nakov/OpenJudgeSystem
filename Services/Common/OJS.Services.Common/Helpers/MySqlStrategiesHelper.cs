namespace OJS.Services.Common.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Text;
    using System.Text.RegularExpressions;
    using OJS.Workers.Common.Models;

    public static class MySqlStrategiesHelper
    {
        private const string InsertIntoTableRegexPattern = @"insert\s+into\s+([^(]+)\s+\([^(]+\)\s+values\s*";

        public static IEnumerable<ExecutionStrategyType> ExecutionStrategyTypesForOptimization => new[]
        {
            ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase,
            ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries,
            ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase,
        };

        private static Regex InsertStatementRegex => new Regex(InsertIntoTableRegexPattern, RegexOptions.IgnoreCase);

        private static readonly string[] Separator = ["\n", "\r\n"];

        public static bool TryOptimizeQuery(string query, out string result)
        {
            if (string.IsNullOrWhiteSpace(query) || !QueryCanBeOptimized(query))
            {
                result = query;
                return false;
            }

            var lines = query.Split(Separator, StringSplitOptions.RemoveEmptyEntries);
            var newQuery = new StringBuilder();
            var wasOptimized = false;

            for (var i = 0; i < lines.Length; i++)
            {
                var currLine = lines[i];
                var prevLine = i > 0 ? lines[i - 1] : string.Empty;
                var nextLine = i < lines.Length - 1 ? lines[i + 1] : string.Empty;

                if (InsertStatementRegex.IsMatch(currLine))
                {
                    currLine = FormatInsertStatement(currLine, prevLine, nextLine, ref wasOptimized);
                }

                newQuery.AppendLine(currLine);
            }

            result = newQuery.ToString();
            return wasOptimized;
        }

        private static string FormatInsertStatement(
            string line,
            string prevLine,
            string nextLine,
            ref bool wasOptimized)
        {
            var prevLineIsInsertStatement = InsertStatementRegex.IsMatch(prevLine);
            var nextLineIsInsertStatement = InsertStatementRegex.IsMatch(nextLine);

            if (prevLineIsInsertStatement || nextLineIsInsertStatement)
            {
                var lineInsertTable = InsertStatementRegex.Match(line).Groups[1].Value;
                var prevLineInsertTable = InsertStatementRegex.Match(prevLine).Groups[1].Value;
                var nextLineInsertTable = InsertStatementRegex.Match(nextLine).Groups[1].Value;

                if (lineInsertTable == prevLineInsertTable)
                {
                    line = InsertStatementRegex.Replace(line, string.Empty);
                    wasOptimized = true;
                }

                if (lineInsertTable == nextLineInsertTable)
                {
                    line = line.Trim().TrimEnd(';') + ',';
                    wasOptimized = true;
                }
                else
                {
                    line += Environment.NewLine;
                }
            }

            return line;
        }

        private static bool QueryCanBeOptimized(string query)
            => InsertStatementRegex.IsMatch(query);
    }
}