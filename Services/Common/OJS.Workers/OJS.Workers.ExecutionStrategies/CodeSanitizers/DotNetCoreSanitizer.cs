namespace OJS.Workers.ExecutionStrategies.CodeSanitizers
{
    using System.Text.RegularExpressions;

    /// <inheritdoc />
    public class DotNetCoreSanitizer : BaseCodeSanitizer
    {
        private const string ConnectionStringSearchPattern = @"(\.\s*UseSqlServer\s*\()(.*)(\))";
        private const string SafeConnectionString = "Data Source=.;";

        /// <inheritdoc/>
        protected override string DoSanitize(string content)
            => Regex.Replace(content, ConnectionStringSearchPattern, $"$1\"{SafeConnectionString}\"$3");
    }
}