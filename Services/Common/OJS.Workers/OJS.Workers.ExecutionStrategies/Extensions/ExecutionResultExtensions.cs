#nullable disable
namespace OJS.Workers.ExecutionStrategies.Extensions
{
    using OJS.Workers.Common.Extensions;
    using OJS.Workers.ExecutionStrategies.Models;

    public static class ExecutionResultExtensions
    {
        private const string ExceededOutputMaxLengthDefaultWarningMessageFormat =
            "... [Output length exceeds the allowed limit of {0} characters]";

        public static void LimitLength(this OutputResult result, int lengthLimit, string appendMessage = null)
        {
            if (result?.Output == null)
            {
                return;
            }

            appendMessage = result.Output.Length <= lengthLimit
                ? string.Empty
                : appendMessage
                    ?? string.Format(ExceededOutputMaxLengthDefaultWarningMessageFormat, lengthLimit);

            result.Output = result.Output.MaxLength(lengthLimit) + appendMessage;
        }
    }
}
