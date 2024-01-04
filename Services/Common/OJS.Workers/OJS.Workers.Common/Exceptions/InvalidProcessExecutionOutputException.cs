namespace OJS.Workers.Common.Exceptions
{
    using System;

    public class InvalidProcessExecutionOutputException : Exception
    {
        private const string CustomMessageTitle = "The process did not produce any valid output!";

        private const string CustomMessage =
            CustomMessageTitle +
            " Please try again later or contact an administrator if the problem persists.";

        public InvalidProcessExecutionOutputException()
            : base(CustomMessage)
        {
        }

        public InvalidProcessExecutionOutputException(string message)
            : base(CustomMessageTitle + Environment.NewLine + message)
        {
        }
    }
}
