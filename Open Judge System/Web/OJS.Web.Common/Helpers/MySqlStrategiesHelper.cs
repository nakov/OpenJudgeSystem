namespace OJS.Web.Common.Helpers
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

        public static string TryOptimizeQuery(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return query;
            }

            var newQuery = new StringBuilder();

            var lines = query.Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            var insertStatementRegex = new Regex(InsertIntoTableRegexPattern, RegexOptions.IgnoreCase);

            for (var i = 0; i < lines.Length; i++)
            {
                var currLine = lines[i];
                var prevLine = i > 0 ? lines[i - 1] : string.Empty;
                var nextLine = i < lines.Length - 1 ? lines[i + 1] : string.Empty;

                if (insertStatementRegex.IsMatch(currLine))
                {
                    currLine = FormatInsertStatement(currLine, prevLine, nextLine, insertStatementRegex);
                }

                newQuery.AppendLine(currLine);
            }

            var result = newQuery.ToString();

            return result;
        }

        private static string FormatInsertStatement(
            string currLine,
            string prevLine,
            string nextLine,
            Regex insertStatementRegex)
        {
            var prevLineIsInsertStatement = insertStatementRegex.IsMatch(prevLine);
            var nextLineIsInsertStatement = insertStatementRegex.IsMatch(nextLine);

            if (prevLineIsInsertStatement || nextLineIsInsertStatement)
            {
                var currLineInsertTable = insertStatementRegex.Match(currLine).Groups[1].Value;
                var prevLineInsertTable = insertStatementRegex.Match(prevLine).Groups[1].Value;
                var nextLineInsertTable = insertStatementRegex.Match(nextLine).Groups[1].Value;

                if (currLineInsertTable == prevLineInsertTable)
                {
                    currLine = insertStatementRegex.Replace(currLine, string.Empty);
                }

                if (currLineInsertTable == nextLineInsertTable)
                {
                    currLine = currLine.TrimEnd(';') + ',';
                }
            }

            return currLine;
        }
    }
}