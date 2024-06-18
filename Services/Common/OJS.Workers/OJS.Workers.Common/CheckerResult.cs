namespace OJS.Workers.Common
{
    public struct CheckerResult
    {
        public CheckerResult()
        {
        }

        public bool IsCorrect { get; set; } = false;

        public CheckerResultType ResultType { get; set; } = default;

        /// <summary>
        /// Gets or sets more detailed information visible only by administrators.
        /// </summary>
        public CheckerDetails CheckerDetails { get; set; } = new();
    }
}
